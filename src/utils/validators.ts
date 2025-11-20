type ValidatorResult = {
  error: string;
  warning: string;
};

type ValidatorFunction = (
  // value: string | number | boolean | File | undefined | Date,
  // ...args: (string | undefined)[]
  value: unknown,
  ...args: unknown[]
) => ValidatorResult;

export const Validators: Record<string, ValidatorFunction> = {
  name: (value) => {
    const result: ValidatorResult = { error: "", warning: "" };

    if (typeof value !== "string") {
      result.error = "Full name is required.";
      return result;
    }

    if (!value.trim()) {
      result.error = "Full name is required.";
    } else if (!/^[A-Za-z\s]+$/.test(value)) {
      result.error = "Only uppercase, lowercase and space allowed.";
    } else if (value.length > 50) {
      result.warning = "Long names might be truncated in some systems.";
    }

    return result;
  },

  address: (value) => {
    const result: ValidatorResult = { error: "", warning: "" };

    if (typeof value !== "string") {
      result.error = "Address is required";
      return result;
    }

    const trimmed = value.trim();

    if (!trimmed) {
      result.error = "Address is required.";
    } else if (trimmed.length < 5 || trimmed.length > 255) {
      result.error = "Address must be between 5–255 characters.";
    } else if (trimmed.length > 150) {
      result.warning =
        "This address is quite long. Please ensure it is accurate and complete.";
    }

    return result;
  },

  email: (value) => {
    const result: ValidatorResult = { error: "", warning: "" };

    if (typeof value !== "string") {
      result.error = "Email is required.";
      return result;
    }

    if (!value.trim()) {
      result.error = "Email is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      result.error = "Invalid email format";
    } else if (
      !value.endsWith("@gmail.com") &&
      !value.endsWith("@yahoo.com") &&
      !value.endsWith("@outlook.com")
    ) {
      result.warning =
        "Consider using your company email for business accounts.";
    }

    return result;
  },

  phone: (value) => {
    const result: ValidatorResult = { error: "", warning: "" };

    if (typeof value !== "string") {
      result.error = "Phone is required";
      return result;
    }

    if (!value.trim()) {
      result.error = "Phone is required";
    } else if (value.length !== 11) {
      result.error = "Phone number must be exactly 11 digits.";
    } else if (!/^[0-9]+$/.test(value)) {
      result.error = "Phone number can only contain numbers.";
    } else if (!value.startsWith("01")) {
      result.error = "Phone number must start with 01.";
    }

    return result;
  },

  password: (value) => {
    const result: ValidatorResult = { error: "", warning: "" };

    if (typeof value !== "string") {
      result.error = "Password is required.";
      return result;
    }

    if (!value) {
      result.error = "Password is required.";
    } else if (
      !/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*]).{8,20}$/.test(value)
    ) {
      result.error =
        "8-20 characters with uppercase, lowercase, number, and special character.";
    } else if (value.length === 8) {
      result.warning =
        "For better security, consider a longer password (12+ characters).";
    }

    return result;
  },

  credential: (value) => {
    const result: ValidatorResult = { error: "", warning: "" };

    if (typeof value !== "string") {
      result.error = "Email or phone is required.";
      return result;
    }

    if (!value.trim()) {
      result.error = "Email or phone is required.";
    }

    return result;
  },

  note: (value) => {
    const result: ValidatorResult = { error: "", warning: "" };

    if (
      typeof value === "string" &&
      value.length !== 0 &&
      (value.length < 5 || value.length > 255)
    ) {
      result.error = "Note must be between 5-255 characters.";
    }

    return result;
  },

  selectDeliveryArea: (value): ValidatorResult => {
    const result: ValidatorResult = { error: "", warning: "" };
    if (!value || (typeof value === "string" && value.trim().length === 0)) {
      result.error = "Please Select Delivery Area";
    }
    return result;
  },
};

export const mapValidationErrors = (
  errorArray: { path: string; message: string }[]
): Record<string, string> => {
  return errorArray.reduce((acc, err) => {
    acc[err.path] = err.message;
    return acc;
  }, {} as Record<string, string>);
};

// =========================
// Updated Usage Example
// =========================
/*
import { Validators } from './validationUtils';

const validateForm = (formData: Record<string, any>) => {
  const errors: Record<string, string> = {};
  const warnings: Record<string, string> = {};

  Object.keys(formData).forEach((key) => {
    const validationResult = Validators[key]?.(formData[key], formData.password);
    if (validationResult?.error) errors[key] = validationResult.error;
    if (validationResult?.warning) warnings[key] = validationResult.warning;
  });

  setErrors(errors);
  setWarnings(warnings);
  return Object.keys(errors).length === 0;
};
*/
