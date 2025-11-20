"use client";
import { RadioButton, RadioButtonProps } from "../atoms/radio-btn";
import { FormFieldWrapper } from "./FormFieldWrapper";

interface RadioOption {
  value: string;
  label: string;
  disabled?: boolean;
}

interface RadioGroupProps {
  id: string;
  options: RadioOption[];
  value: string;
  onChange: (value: string) => void;
  label?: string;
  error?: string;
  className?: string;
  radioButtonProps?: Omit<RadioButtonProps, "id" | "name" | "value" | "label" | "checked" | "onChange" | "disabled">;
}

export const RadioGroup = ({
  id,
  options,
  value,
  onChange,
  label,
  error,
  className,
  radioButtonProps,
}: RadioGroupProps) => {
  return (
    <FormFieldWrapper id={id} label={label} error={error} className={className}>
      <div className='space-y-2'>
        {options.map((option) => (
          <RadioButton
            key={`${id}-${option.value}`}
            id={`${id}-${option.value}`}
            name={id}
            value={option.value}
            label={option.label}
            checked={value === option.value}
            onChange={() => onChange(option.value)}
            disabled={option.disabled}
            error={!!error}
            {...radioButtonProps}
          />
        ))}
      </div>
    </FormFieldWrapper>
  );
};
