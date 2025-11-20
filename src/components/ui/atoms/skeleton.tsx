import { forwardRef } from "react";
import { twMerge } from "tailwind-merge";

const Skeleton = forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(({ className, ...props }, ref) => (
  <div ref={ref} className={twMerge("animate-pulse rounded-md bg-gray-200 dark:bg-gray-700", className)} {...props} />
));

Skeleton.displayName = "Skeleton";

export { Skeleton };
