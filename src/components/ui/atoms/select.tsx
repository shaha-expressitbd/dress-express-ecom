"use client";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { FiCheck, FiChevronDown, FiX } from "react-icons/fi";
import { twMerge } from "tailwind-merge";
import { FormFieldWrapper } from "../molecules/FormFieldWrapper";

export interface Option {
  label: string;
  value: string | number;
  disabled?: boolean;
}

interface SelectProps {
  options: Option[];
  placeholder?: string;
  onChange: (selectedOptions: Option[]) => void;
  mode?: "single" | "multi";
  value: Option[];
  className?: string;
  disabled?: boolean;
  searchable?: boolean;
  searchPosition?: "trigger" | "dropdown";
  menuPlacement?: "bottom" | "top" | "right" | "left" | "auto";
  dropdownSize?: "sm" | "md" | "lg";
  dropdownWidth?: "xs" | "sm" | "md" | "lg" | "full" | string;
  id?: string;
  label?: string;
  required?: boolean;
  error?: string;
  warning?: string;
  labelRightElement?: React.ReactNode;
  preserveErrorSpace?: boolean;
  showError?: boolean;
  dropdownIndicator?: React.ComponentType<{ className?: string }>;
  clearAllConfirmation?: string;
  noOptionsMessage?: string | React.ReactNode | ((searchTerm: string) => React.ReactNode);
  searchPlaceholder?: string;
  showSelectAll?: boolean;
  selectAllLabel?: string;
  animation?: boolean;
}

const DROPDOWN_MARGIN = 5;

const Select: React.FC<SelectProps> = ({
  options,
  value = [],
  placeholder = "Select...",
  onChange,
  mode = "single",
  className,
  disabled = false,
  searchable = false,
  searchPosition = "dropdown",
  menuPlacement = "auto", // Default to auto for smart placement
  dropdownSize = "md",
  dropdownWidth = "full",
  id,
  label,
  required = false,
  error,
  warning,
  labelRightElement,
  preserveErrorSpace = true,
  showError = true,
  dropdownIndicator: DropdownIndicator = FiChevronDown,
  clearAllConfirmation = "Are you sure you want to clear all selections?",
  noOptionsMessage = "No options found",
  searchPlaceholder = "Search...",
  showSelectAll = false,
  selectAllLabel = "Select All",
  animation = true,
}: SelectProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [dropdownPosition, setDropdownPosition] = useState({
    top: 0,
    left: 0,
    right: undefined as number | undefined,
    bottom: undefined as number | undefined,
    width: 0,
  });
  const [actualPlacement, setActualPlacement] = useState(menuPlacement);
  // Track if dropdown height has been measured
  const [dropdownHeight, setDropdownHeight] = useState<number | null>(null);

  const filteredOptions = options.filter((option) => option.label.toLowerCase().includes(searchTerm.toLowerCase()));
  const enabledOptions = filteredOptions.filter((option) => !option.disabled);

  const isSelected = useCallback((option: Option) => value.some((v) => v.value === option.value), [value]);

  const isAllSelected = useCallback(
    () => enabledOptions.length > 0 && enabledOptions.every((o) => isSelected(o)),
    [enabledOptions, isSelected]
  );

  // Calculate expected dropdown height
  const calculateDropdownHeight = useCallback(() => {
    if (dropdownRef.current) {
      return dropdownRef.current.offsetHeight;
    }

    // Estimate height based on number of options and UI elements
    const optionsHeight = filteredOptions.length * 36; // ~36px per option
    const searchHeight = searchable && searchPosition === "dropdown" ? 52 : 0; // Search input + padding
    const selectAllHeight = showSelectAll && mode === "multi" ? 36 : 0;
    const paddingHeight = 16; // Top and bottom padding

    // Use appropriate max height based on dropdownSize
    const maxHeights = {
      sm: 160, // max-h-40 = 10rem = 160px
      md: 240, // max-h-60 = 15rem = 240px
      lg: 320, // max-h-80 = 20rem = 320px
    };

    const totalHeight = Math.min(
      optionsHeight + searchHeight + selectAllHeight + paddingHeight,
      maxHeights[dropdownSize]
    );
    return totalHeight;
  }, [filteredOptions.length, searchable, searchPosition, showSelectAll, mode, dropdownSize]);

  const calculateBestPlacement = useCallback(() => {
    if (!containerRef.current || (menuPlacement !== "auto" && menuPlacement !== "top" && menuPlacement !== "bottom")) {
      return menuPlacement;
    }

    // If menuPlacement is specifically set to top or bottom, respect that setting
    if (menuPlacement === "top") return "top";
    if (menuPlacement === "bottom") return "bottom";

    const rect = containerRef.current.getBoundingClientRect();
    const viewportHeight = window.innerHeight;

    // Get dropdown height (measured or estimated)
    const estimatedHeight = calculateDropdownHeight();

    // Space available below and above the trigger
    const spaceBelow = viewportHeight - rect.bottom;
    const spaceAbove = rect.top;

    // Determine best placement based on available space
    if (spaceBelow >= estimatedHeight || spaceBelow >= spaceAbove) {
      return "bottom";
    } else {
      return "top";
    }
  }, [menuPlacement, calculateDropdownHeight]);

  const updateDropdownPosition = useCallback(() => {
    if (!containerRef.current || !isOpen) return;

    // Get best placement
    const placement = calculateBestPlacement();
    setActualPlacement(placement);

    const rect = containerRef.current.getBoundingClientRect();
    const viewportHeight = window.innerHeight;
    const viewportWidth = window.innerWidth;

    // Store actual dropdown height once it's rendered
    if (dropdownRef.current && !dropdownHeight) {
      setDropdownHeight(dropdownRef.current.offsetHeight);
    }

    let position = {
      top: 0,
      left: 0,
      right: undefined as number | undefined,
      bottom: undefined as number | undefined,
      width: rect.width,
    };

    // Calculate position based on placement
    switch (placement) {
      case "bottom":
        position = {
          top: rect.bottom + DROPDOWN_MARGIN,
          left: rect.left,
          right: undefined,
          bottom: undefined,
          width: rect.width,
        };

        // Adjust if dropdown goes beyond screen width
        if (position.left + position.width > viewportWidth) {
          position.left = Math.max(0, viewportWidth - position.width);
        }
        break;

      case "top": {
        // Use measured height if available for more precision
        const currentHeight = dropdownHeight || calculateDropdownHeight();

        position = {
          top: rect.top - currentHeight - DROPDOWN_MARGIN,
          left: rect.left,
          right: undefined,
          bottom: undefined,
          width: rect.width,
        };

        // If dropdown would go above viewport, anchor it to top of screen with scrolling
        if (position.top < 0) {
          position.top = 2; // Small margin from top
        }

        // Adjust if dropdown goes beyond screen width
        if (position.left + position.width > viewportWidth) {
          position.left = Math.max(0, viewportWidth - position.width);
        }
        break;
      }

      case "right":
        position = {
          top: rect.top,
          left: rect.right + DROPDOWN_MARGIN,
          right: undefined,
          bottom: undefined,
          width: rect.width,
        };

        // Adjust if dropdown goes beyond screen height
        if (position.top + (dropdownRef.current?.offsetHeight || calculateDropdownHeight()) > viewportHeight) {
          position.top = Math.max(0, viewportHeight - (dropdownRef.current?.offsetHeight || calculateDropdownHeight()));
        }
        break;

      case "left":
        position = {
          top: rect.top,
          left: 0,
          right: viewportWidth - rect.left + DROPDOWN_MARGIN,
          bottom: undefined,
          width: rect.width,
        };

        // Adjust if dropdown goes beyond screen height
        if (position.top + (dropdownRef.current?.offsetHeight || calculateDropdownHeight()) > viewportHeight) {
          position.top = Math.max(0, viewportHeight - (dropdownRef.current?.offsetHeight || calculateDropdownHeight()));
        }
        break;
    }

    setDropdownPosition(position);
  }, [isOpen, calculateBestPlacement, calculateDropdownHeight, dropdownHeight]);

  const openDropdown = useCallback(() => {
    setIsOpen(true);
    // Reset dropdown height when opening
    setDropdownHeight(null);
  }, []);

  const handleToggle = (e?: React.MouseEvent) => {
    if (disabled) return;
    if (e && searchPosition === "trigger" && inputRef.current?.contains(e.target as Node)) {
      return;
    }
    if (!isOpen) {
      openDropdown();
    } else {
      setIsOpen(false);
      setSearchTerm("");
    }
  };

  const handleOptionClick = (option: Option) => {
    if (!disabled && !option.disabled) {
      if (mode === "multi") {
        const exists = value.find((v) => v.value === option.value);
        const newSelections = exists ? value.filter((v) => v.value !== option.value) : [...value, option];
        onChange(newSelections);
      } else {
        onChange([option]);
        setIsOpen(false);
      }
      setSearchTerm("");
    }
  };

  const handleRemove = (option: Option) => {
    if (!disabled) {
      onChange(value.filter((v) => v.value !== option.value));
    }
  };

  const handleClearAll = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!clearAllConfirmation || confirm(clearAllConfirmation)) {
      onChange([]);
    }
  };

  const handleSelectAll = () => {
    if (disabled) return;
    if (isAllSelected()) {
      onChange([]);
    } else {
      const selectableOptions = enabledOptions.filter((option) => !option.disabled);
      onChange(selectableOptions);
    }
  };

  // Update position when dropdown is opened
  useEffect(() => {
    if (isOpen) {
      // Initial position calculation
      updateDropdownPosition();

      // Add scroll and resize listeners when dropdown is open
      window.addEventListener("scroll", updateDropdownPosition, true);
      window.addEventListener("resize", updateDropdownPosition);

      // Update position after a brief delay to ensure dropdown is rendered
      const timer = setTimeout(() => {
        updateDropdownPosition();
      }, 10);

      return () => {
        window.removeEventListener("scroll", updateDropdownPosition, true);
        window.removeEventListener("resize", updateDropdownPosition);
        clearTimeout(timer);
      };
    }
  }, [isOpen, updateDropdownPosition]);

  // Update position when filtered options change (affects height)
  useEffect(() => {
    if (isOpen) {
      updateDropdownPosition();
    }
  }, [filteredOptions.length, isOpen, updateDropdownPosition]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node;
      if (
        containerRef.current &&
        !containerRef.current.contains(target) &&
        dropdownRef.current &&
        !dropdownRef.current.contains(target)
      ) {
        setIsOpen(false);
        setSearchTerm("");
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const dropdownSizeStyles = {
    sm: "max-h-40",
    md: "max-h-60",
    lg: "max-h-80",
  };

  const dropdownWidthStyles: Record<string, string> = {
    xs: "min-w-[100px]",
    sm: "min-w-[150px]",
    md: "min-w-[200px]",
    lg: "min-w-[300px]",
    full: "w-full",
  };

  // Animation classes based on placement
  const getAnimationClasses = () => {
    if (!animation) return "";

    switch (actualPlacement) {
      case "bottom":
        return "animate-slide-down-fade";
      case "top":
        return "animate-slide-up-fade";
      case "right":
        return "animate-slide-right-fade";
      case "left":
        return "animate-slide-left-fade";
      default:
        return "animate-fade-in";
    }
  };

  return (
    <FormFieldWrapper
      id={id}
      label={label}
      error={error}
      showError={showError}
      warning={warning}
      required={required}
      labelRightElement={labelRightElement}
      preserveErrorSpace={preserveErrorSpace}
    >
      <div className='relative' ref={containerRef}>
        {/* Trigger */}
        <div
          id={id}
          onClick={handleToggle}
          className={twMerge(
            "w-full flex items-center p-2 h-10 rounded border bg-white dark:bg-gray-800 text-gray-900 dark:text-white",
            "cursor-pointer select-none",
            "border-gray-300 dark:border-gray-600 hover:border-orange-400 dark:hover:border-orange-400 focus:outline-none",
            isOpen && "ring-2 ring-orange-200 dark:ring-orange-600",
            error && "border-red-500",
            disabled && "opacity-50 cursor-not-allowed",
            className
          )}
        >
          <div className='flex-1 flex flex-wrap gap-1 overflow-hidden'>
            {searchable && searchPosition === "trigger" ? (
              <div className='flex gap-1 w-full'>
                {mode === "multi" && value.length > 0 && (
                  <div className='flex overflow-x-scroll gap-1 max-w-2/3 scrollbar-none'>
                    {value.map((v) => (
                      <span
                        key={v.value}
                        className='inline-flex items-center px-2 py-0.5 bg-orange-50 text-orange-700 text-xs rounded text-nowrap'
                      >
                        {v.label}
                        {!disabled && (
                          <FiX
                            className='ml-1 w-3 h-3 cursor-pointer'
                            onClick={(e) => {
                              e.stopPropagation();
                              handleRemove(v);
                            }}
                          />
                        )}
                      </span>
                    ))}
                  </div>
                )}
                <input
                  ref={inputRef}
                  type='text'
                  value={searchTerm}
                  placeholder={value.length === 0 ? placeholder : ""}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    if (!isOpen) openDropdown();
                  }}
                  onFocus={openDropdown}
                  className='flex-1 min-w-[50px] bg-transparent outline-none text-sm placeholder-gray-400'
                  onClick={(e) => e.stopPropagation()}
                />
              </div>
            ) : mode === "multi" && value.length > 0 ? (
              value.map((v) => (
                <span
                  key={v.value}
                  className='inline-flex items-center px-2 py-0.5 bg-orange-50 text-orange-700 text-xs rounded'
                >
                  {v.label}
                  {!disabled && (
                    <FiX
                      className='ml-1 w-3 h-3 cursor-pointer'
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemove(v);
                      }}
                    />
                  )}
                </span>
              ))
            ) : mode === "single" && value.length > 0 ? (
              <span className=''>{value[0].label}</span>
            ) : (
              <span className='text-gray-400 truncate'>{placeholder}</span>
            )}
          </div>

          {mode === "multi" && value.length > 0 && !disabled && (
            <FiX className='ml-2 w-4 h-4 text-gray-400 hover:text-red-500 cursor-pointer' onClick={handleClearAll} />
          )}
          <DropdownIndicator className='ml-2 w-4 h-4 text-gray-400' />
        </div>

        {/* Dropdown */}
        {isOpen &&
          createPortal(
            <div
              ref={dropdownRef}
              className={twMerge(
                "fixed z-[99999] bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 shadow-lg rounded overflow-auto dark:text-white",
                dropdownSizeStyles[dropdownSize],
                dropdownWidthStyles[dropdownWidth] || dropdownWidth,
                getAnimationClasses()
              )}
              style={{
                top: dropdownPosition.top,
                left: dropdownPosition.left,
                right: dropdownPosition.right,
                bottom: dropdownPosition.bottom,
                width: dropdownPosition.width,
              }}
              role='listbox'
              onAnimationEnd={() => {
                // Update position after animation completes
                if (dropdownRef.current && !dropdownHeight) {
                  setDropdownHeight(dropdownRef.current.offsetHeight);
                  updateDropdownPosition();
                }
              }}
            >
              {searchable && searchPosition === "dropdown" && (
                <div className='p-2 border-b dark:border-gray-600'>
                  <input
                    ref={inputRef}
                    type='text'
                    value={searchTerm}
                    placeholder={searchPlaceholder}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className='w-full h-8 px-2 rounded border border-gray-300  dark:border-gray-600 focus:ring-2 focus:ring-orange-300 dark:focus:ring-orange-600'
                    autoFocus
                  />
                </div>
              )}
              {showSelectAll && mode === "multi" && (
                <div
                  onClick={handleSelectAll}
                  className='px-3 py-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700'
                >
                  {isAllSelected() ? "Deselect All" : selectAllLabel}
                </div>
              )}
              {filteredOptions.length > 0 ? (
                filteredOptions.map((option) => (
                  <div
                    key={option.value}
                    onClick={() => handleOptionClick(option)}
                    className={twMerge(
                      "px-3 py-2 cursor-pointer flex items-center text-nowrap",
                      isSelected(option)
                        ? "bg-orange-100 dark:bg-orange-700 text-orange-700 dark:text-white"
                        : "hover:bg-gray-100 dark:hover:bg-gray-700",
                      option.disabled && "opacity-50 cursor-not-allowed"
                    )}
                  >
                    {mode === "multi" && (
                      <div className='w-4 h-4 mr-2 flex items-center justify-center border border-gray-300 dark:border-gray-500 rounded'>
                        {isSelected(option) && <FiCheck className='w-3 h-3 text-orange-600' />}
                      </div>
                    )}
                    {option.label}
                  </div>
                ))
              ) : (
                <div className='px-2 py-2 text-gray-400'>
                  {typeof noOptionsMessage === "function" ? noOptionsMessage(searchTerm) : noOptionsMessage}
                </div>
              )}
            </div>,
            document.body
          )}
      </div>
    </FormFieldWrapper>
  );
};

export default Select;
