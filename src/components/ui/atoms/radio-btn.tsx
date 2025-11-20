"use client";
import React from "react";
import { twMerge } from "tailwind-merge";

export interface RadioButtonProps {
  id: string;
  name: string;
  value: string;
  label: string;
  checked?: boolean;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  disabled?: boolean;
  className?: string;
  inputClassName?: string;
  labelClassName?: string;
  error?: boolean;
}

export const RadioButton = React.forwardRef<HTMLInputElement, RadioButtonProps>(
  (
    {
      id,
      name,
      value,
      label,
      checked = false,
      onChange,
      disabled = false,
      className = "",
      inputClassName = "",
      labelClassName = "",
      error = false,
    },
    ref
  ) => {
    return (
      <div className={twMerge("flex items-center gap-2", className)}>
        <input
          ref={ref}
          type='radio'
          id={id}
          name={name}
          value={value}
          checked={checked}
          onChange={onChange}
          disabled={disabled}
          className={twMerge(
            "h-4 w-4 rounded-full border-2 transition-colors focus:ring-2 focus:ring-offset-0 focus:outline-none",
            error
              ? "border-red-500 text-red-600 focus:ring-red-200"
              : "border-gray-300 text-orange-600 focus:ring-orange-200",
            disabled && "cursor-not-allowed opacity-50",
            inputClassName
          )}
          aria-disabled={disabled}
        />
        <label
          htmlFor={id}
          className={twMerge(
            "text-sm font-medium",
            disabled ? "text-gray-400" : "text-gray-700",
            error && !disabled && "text-red-600",
            labelClassName
          )}
        >
          {label}
        </label>
      </div>
    );
  }
);

RadioButton.displayName = "RadioButton";
