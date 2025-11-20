"use client";
import { twMerge } from "tailwind-merge";
import { FormFieldWrapper } from "../molecules/FormFieldWrapper";

interface CheckboxProps {
  id: string;
  label?: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
  error?: string;
  className?: string;
}

export const Checkbox = ({ id, label, checked, onChange, disabled, error, className }: CheckboxProps) => (
  <FormFieldWrapper id={id} label={label} error={error} className={className}>
    <div className='flex items-center'>
      <input
        id={id}
        type='checkbox'
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        disabled={disabled}
        className={twMerge(
          "h-4 w-4 rounded border focus:ring-2 focus:ring-offset-0",
          error
            ? "border-red-500 text-red-600 focus:ring-red-200"
            : "border-gray-300 text-orange-600 focus:ring-orange-200",
          disabled && "cursor-not-allowed opacity-50"
        )}
      />
      {label && (
        <label htmlFor={id} className='ml-2 block text-sm text-gray-700 dark:text-gray-300'>
          {label}
        </label>
      )}
    </div>
  </FormFieldWrapper>
);
