// LoadingSpinners.tsx
import { twMerge } from "tailwind-merge";

type Size = "xs" | "sm" | "md" | "lg";
type Color =
  | "primary"
  | "secondary"
  | "accent"
  | "white"
  | "blue"
  | "red"
  | "green"
  | "gray";

const sizeClasses: Record<Size, string> = {
  xs: "h-3 w-3 border",
  sm: "h-5 w-5 border-2",
  md: "h-7 w-7 border-3",
  lg: "h-10 w-10 border-4",
};

const colorClasses: Record<Color, string> = {
  primary: "--color-primary",
  secondary: "border-secondary",
  accent: "border-accent",
  white: "border-white",
  blue: "border-blue-500",
  red: "border-red-500",
  green: "border-green-500",
  gray: "border-gray-500",
};

// BaseSpinner.tsx

interface BaseSpinnerProps {
  size?: Size;
  color?: Color;
  className?: string;
  "aria-label"?: string;
  children?: React.ReactNode;
}

const BaseSpinner = ({
  size = "md",
  color = "primary",
  className,
  "aria-label": ariaLabel = "Loading...",
  children,
}: BaseSpinnerProps) => (
  <div
    role="status"
    aria-label={ariaLabel}
    className={twMerge(
      "animate-spin rounded-full",
      sizeClasses[size],
      colorClasses[color],
      className
    )}
  >
    {children}
  </div>
);

// Main spinning ring loader
export const LoadingSpinner = ({
  size = "md",
  color = "white",
  className,
  "aria-label": ariaLabel = "Loading...",
}: {
  size?: Size;
  color?: Color;
  className?: string;
  "aria-label"?: string;
}) => (
  <BaseSpinner
    size={size}
    color={color}
    className={twMerge("border-t-transparent", className)}
    aria-label={ariaLabel}
  />
);

// Dual color spinning loader
export const LoadingSpinnerDualColor = ({
  size = "md",
  className,
  primaryColor = "primary",
  secondaryColor = "red-500",
  "aria-label": ariaLabel = "Loading...",
}: {
  size?: Size;
  className?: string;
  primaryColor?: string;
  secondaryColor?: string;
  "aria-label"?: string;
}) => (
  <div
    role="status"
    aria-label={ariaLabel}
    className={twMerge(
      "relative border-transparent",
      sizeClasses[size],
      className
    )}
  >
    <div
      className={`absolute animate-spin inset-0 reverse rounded-full border-3 border-${secondaryColor} border-b-transparent`}
    />
    <div
      className={`absolute animate-spin inset-0 rounded-full border-3 border-${primaryColor}  border-t-transparent`}
    />
  </div>
);

// Bouncing dots loader
export const LoadingSpinnerBounce = ({
  dotColor = "bg-primary",
  className,
  "aria-label": ariaLabel = "Loading...",
}: {
  dotColor?: string;
  className?: string;
  "aria-label"?: string;
}) => (
  <div
    role="status"
    aria-label={ariaLabel}
    className={twMerge("flex space-x-1", className)}
  >
    {[...Array(3)].map((_, i) => (
      <div
        key={i}
        className={twMerge(
          "h-2 w-2 rounded-full motion-safe:animate-bounce",
          dotColor
        )}
        style={{ animationDelay: `${i * 200}ms` }}
      />
    ))}
  </div>
);

// Ping/pulse animation loader
export const LoadingSpinnerPulse = ({
  size = "md",
  className,
  "aria-label": ariaLabel = "Loading...",
}: {
  size?: Size;
  className?: string;
  "aria-label"?: string;
}) => (
  <BaseSpinner
    size={size}
    className={twMerge("animate-ping", className)}
    aria-label={ariaLabel}
  />
);

// Typing indicator style loader
export const LoadingSpinnerTyping = ({
  dotColor = "gray-900",
  className,
  "aria-label": ariaLabel = "Loading...",
}: {
  dotColor?: string;
  className?: string;
  "aria-label"?: string;
}) => (
  <div
    role="status"
    aria-label={ariaLabel}
    className={twMerge("flex space-x-1", className)}
  >
    {[...Array(3)].map((_, i) => (
      <div
        key={i}
        className={`h-2 w-2 rounded-full animate-pulse bg-${dotColor}`}
        style={{ animationDelay: `${i * 200}ms` }}
      />
    ))}
  </div>
);
