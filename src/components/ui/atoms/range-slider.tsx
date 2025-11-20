"use client";
import { twMerge } from "tailwind-merge";
import { FormFieldWrapper } from "../molecules/FormFieldWrapper";

interface RangeSliderProps {
  id: string;
  label?: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  onChange: (value: number) => void;
  disabled?: boolean;
  error?: string;
  className?: string;
}

export const RangeSlider = ({
  id,
  label,
  value,
  min,
  max,
  step = 1,
  onChange,
  disabled,
  error,
  className,
}: RangeSliderProps) => (
  <FormFieldWrapper id={id} label={label} error={error} className={className}>
    <div className='flex items-center space-x-4'>
      <input
        id={id}
        type='range'
        value={value}
        min={min}
        max={max}
        step={step}
        onChange={(e) => onChange(Number(e.target.value))}
        disabled={disabled}
        className={twMerge(
          "w-full h-2 rounded-lg appearance-none cursor-pointer",
          error ? "bg-red-200 accent-red-600" : "bg-gray-200 accent-orange-600",
          disabled && "cursor-not-allowed opacity-50"
        )}
      />
      <span className='text-sm font-medium text-gray-700 dark:text-gray-300 min-w-[3ch] text-right'>{value}</span>
    </div>
  </FormFieldWrapper>
);
