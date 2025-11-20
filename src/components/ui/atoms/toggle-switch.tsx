"use client";
import React from "react";
import { twMerge } from "tailwind-merge";
import { FormFieldWrapper } from "../molecules/FormFieldWrapper";

export interface ToggleSwitchProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange" | "size"> {
  id: string;
  label?: string;
  checked: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  className?: string;
  labelPosition?: "left" | "right";
  error?: string;
  preserveErrorSpace?: boolean;
  size?: "sm" | "md" | "lg";
  loading?: boolean;
  labelClassName?: string;
  showStateText?: boolean;
}

export const ToggleSwitch: React.FC<ToggleSwitchProps> = ({
  id,
  label,
  checked,
  onChange,
  className,
  labelPosition = "right",
  disabled,
  error,
  preserveErrorSpace = false,
  size = "md",
  loading = false,
  labelClassName,
  showStateText = false,
  ...props
}) => {
  const handleToggleClick = () => {
    if (disabled || loading) return;
    onChange({ target: { checked: !checked, id } } as React.ChangeEvent<HTMLInputElement>);
  };

  const sizeClasses = {
    sm: {
      container: "h-4 w-7",
      thumb: "h-3 w-3",
      translate: "translate-x-3",
    },
    md: {
      container: "h-5 w-9",
      thumb: "h-4 w-4",
      translate: "translate-x-4",
    },
    lg: {
      container: "h-6 w-11",
      thumb: "h-5 w-5",
      translate: "translate-x-5",
    },
  };

  return (
    <FormFieldWrapper
      id={id}
      error={error}
      preserveErrorSpace={preserveErrorSpace}
      className={twMerge("w-fit", className)}
    >
      <div
        className={twMerge("flex items-center gap-3", labelPosition === "left" ? "flex-row-reverse justify-end" : "")}
      >
        {/* Hidden checkbox input */}
        <input
          type='checkbox'
          id={id}
          checked={checked}
          onChange={onChange}
          className='sr-only'
          disabled={disabled || loading}
          {...props}
        />

        <div className='flex items-center gap-2'>
          {/* Toggle switch */}
          <button
            type='button'
            role='switch'
            aria-checked={checked}
            aria-disabled={disabled || loading}
            disabled={disabled || loading}
            onClick={handleToggleClick}
            className={twMerge(
              "relative inline-flex items-center rounded-full transition-colors duration-200",
              sizeClasses[size].container,
              checked ? (error ? "bg-red-600" : "bg-primary") : "bg-gray-200 dark:bg-gray-600",
              disabled || loading
                ? "cursor-not-allowed opacity-70"
                : "cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-2",
              error ? "focus:ring-red-200 dark:focus:ring-red-800" : "focus:ring-orange-200 dark:focus:ring-orange-800",
              loading && "opacity-80"
            )}
          >
            <span
              className={twMerge(
                "inline-block rounded-full bg-white shadow-sm ring-0 transition-transform duration-200",
                sizeClasses[size].thumb,
                checked ? sizeClasses[size].translate : "translate-x-0.5",
                disabled ? "bg-gray-100" : "",
                loading && "opacity-70"
              )}
            />
            {loading && (
              <span className='absolute inset-0 flex items-center justify-center'>
                <span className='animate-spin h-3 w-3 border-2 border-white border-t-transparent rounded-full' />
              </span>
            )}
          </button>

          {showStateText && (
            <span
              className={twMerge(
                "text-xs font-medium",
                checked
                  ? error
                    ? "text-red-600 dark:text-red-400"
                    : "text-primary dark:text-orange-400"
                  : "text-gray-500 dark:text-gray-400",
                disabled && "opacity-50"
              )}
            >
              {checked ? "On" : "Off"}
            </span>
          )}
        </div>

        {/* Visible label */}
        {label && (
          <label
            htmlFor={id}
            className={twMerge(
              "block text-sm font-medium select-none",
              error ? "text-red-600 dark:text-red-500" : "text-gray-700 dark:text-gray-300",
              (disabled || loading) && "opacity-70 cursor-not-allowed",
              labelClassName
            )}
          >
            {label}
            {loading && (
              <span className='ml-2 inline-block h-3 w-3 animate-spin rounded-full border-2 border-current border-t-transparent' />
            )}
          </label>
        )}
      </div>
    </FormFieldWrapper>
  );
};
