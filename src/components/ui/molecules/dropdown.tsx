import React, { useEffect, useRef, useState } from "react";
import { twMerge } from "tailwind-merge";

interface DropdownProps {
  children: React.ReactNode;
  className?: string;
  align?: "left" | "right" | "center";
  isDropdownOpen?: boolean;
  onOpenChange?: (isDropdownOpen: boolean) => void;
}

export const Dropdown = ({
  children,
  className = "",
  align = "left",
  isDropdownOpen: isDropdownOpenProp,
  onOpenChange,
}: DropdownProps) => {
  const [isDropdownOpenInternal, setIsDropdownOpenInternal] = useState(false);
  const [triggerWidth, setTriggerWidth] = useState(0);
  const isControlled = isDropdownOpenProp !== undefined;
  const isDropdownOpen = isControlled
    ? isDropdownOpenProp
    : isDropdownOpenInternal;

  const toggleDropdown = () => {
    const newState = !isDropdownOpen;
    if (!isControlled) setIsDropdownOpenInternal(newState);
    onOpenChange?.(newState);
  };

  const handleClickOutside = () => {
    if (!isControlled) setIsDropdownOpenInternal(false);
    onOpenChange?.(false);
  };

  return (
    <div className={twMerge("relative", className)}>
      {React.Children.map(children, (child) => {
        if (React.isValidElement(child)) {
          return React.cloneElement(child, {
            ...(child.type === DropdownTrigger
              ? { toggleDropdown, setTriggerWidth, isDropdownOpen }
              : {}),
            ...(child.type === DropdownContent
              ? {
                  isDropdownOpen,
                  align,
                  triggerWidth,
                  handleClickOutside,
                }
              : {}),
          });
        }
        return child;
      })}
    </div>
  );
};

interface DropdownTriggerProps {
  children: React.ReactNode;
  toggleDropdown?: () => void;
  setTriggerWidth?: (width: number) => void;
}

export const DropdownTrigger = ({
  children,
  toggleDropdown,
  setTriggerWidth,
}: DropdownTriggerProps) => {
  const triggerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (triggerRef.current && setTriggerWidth) {
      setTriggerWidth(triggerRef.current.offsetWidth);
    }
  }, [setTriggerWidth]);

  return (
    <div
      ref={triggerRef}
      className="dropdown-trigger cursor-pointer"
      onClick={toggleDropdown}
    >
      {children}
    </div>
  );
};

interface DropdownContentProps {
  children: React.ReactNode;
  isDropdownOpen?: boolean;
  align?: "left" | "right" | "center"; // Add "center" to the align options
  triggerWidth?: number;
  className?: string;
  handleClickOutside?: () => void;
}

export const DropdownContent = ({
  children,
  isDropdownOpen,
  align = "left",
  triggerWidth,
  className = "",
  handleClickOutside,
}: DropdownContentProps) => {
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      if (
        contentRef.current &&
        !contentRef.current.contains(event.target as Node)
      ) {
        handleClickOutside?.();
      }
    };

    document.addEventListener("mousedown", handleClick);
    return () => {
      document.removeEventListener("mousedown", handleClick);
    };
  }, [handleClickOutside]);

  if (!isDropdownOpen) return null;

  return (
    <>
      <div
        className="fixed inset-0 z-40 bg-transparent"
        onClick={handleClickOutside}
      />
      <div
        ref={contentRef}
        className={twMerge(
          "absolute z-50 mt-2 rounded border border-gray-200 bg-white shadow-lg",
          align === "left"
            ? "left-0"
            : align === "right"
              ? "right-0"
              : "left-1/2 -translate-x-1/2 transform", // Center alignment logic
          className,
        )}
        style={{ minWidth: triggerWidth }}
      >
        {children}
      </div>
    </>
  );
};
