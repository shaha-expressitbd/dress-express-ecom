"use client";
import React from "react";
import { IconType } from "react-icons";
import { twMerge } from "tailwind-merge";
import { FormFieldWrapper } from "../molecules/FormFieldWrapper";

export interface TextareaFieldProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  id: string;
  label?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  icon?: IconType;
  rightElement?: React.ReactNode;
  labelRightElement?: React.ReactNode;
  className?: string;
  inputClassName?: string;
  preserveErrorSpace?: boolean;
  error?: string;
  warning?: string;
  showCharacterCount?: boolean; // New prop to toggle character count visibility
}

export const TextareaField = ({
  id,
  label,
  value = "",
  onChange,
  icon,
  rightElement,
  labelRightElement,
  className,
  inputClassName,
  preserveErrorSpace = true,
  error,
  warning,
  showCharacterCount = true,
  maxLength,
  ...props
}: TextareaFieldProps) => {
  return (
    <FormFieldWrapper
      id={id}
      label={label}
      error={error}
      warning={warning}
      required={props.required}
      labelRightElement={labelRightElement}
      preserveErrorSpace={preserveErrorSpace}
      className={className}
    >
      <div className='relative'>
        {icon && (
          <div className='absolute left-3 top-3 text-gray-400 dark:text-gray-500'>
            {React.createElement(icon, { className: "w-4 h-4" })}
          </div>
        )}
        <textarea
          id={id}
          value={value}
          onChange={onChange}
          className={twMerge(
            "w-full min-h-[80px] px-3 py-2 rounded border text-sm",
            "focus:outline-none focus:ring-2 focus:border-transparent",
            "bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100",
            "placeholder-gray-400 dark:placeholder-gray-400",
            "disabled:bg-gray-50 dark:disabled:bg-gray-800/50 disabled:opacity-75",
            error
              ? "border-red-500 focus:ring-red-200 dark:focus:ring-red-500/30"
              : "border-gray-300 dark:border-gray-600 hover:border-orange-400 dark:hover:border-orange-400 focus:ring-orange-200 dark:focus:ring-orange-400",
            icon ? "pl-10" : "pl-3",
            rightElement ? "pr-10" : "pr-3",
            inputClassName
          )}
          maxLength={maxLength}
          {...props}
        />
        {rightElement && <div className='absolute right-3 top-3'>{rightElement}</div>}
        {(showCharacterCount || maxLength) && (
          <div className='absolute right-3 bottom-3 flex justify-end mt-1 text-xs text-gray-500 dark:text-gray-400'>
            Count: {value.length}
            {maxLength && `/${maxLength}`}
          </div>
        )}

        {/* Character count display */}
      </div>
    </FormFieldWrapper>
  );
};
