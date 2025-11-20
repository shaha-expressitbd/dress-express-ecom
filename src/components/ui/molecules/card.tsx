import { HTMLAttributes, forwardRef } from 'react';
import { twMerge } from 'tailwind-merge';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'elevated' | 'outline' | 'filled';
  size?: 'default' | 'sm' | 'lg';
}

const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant = 'default', size = 'default', ...props }, ref) => {
    const baseClasses =
      'rounded-lg border bg-card text-card-foreground shadow-sm';

    const variantClasses = {
      default: '',
      elevated: 'shadow-md',
      outline: 'border border-gray-200 dark:border-gray-700',
      filled: 'bg-gray-50 dark:bg-gray-800',
    };

    const sizeClasses = {
      default: 'p-6',
      sm: 'p-4',
      lg: 'p-8',
    };

    return (
      <div
        ref={ref}
        className={twMerge(
          baseClasses,
          variantClasses[variant],
          sizeClasses[size],
          className
        )}
        {...props}
      />
    );
  }
);

Card.displayName = 'Card';

const CardHeader = ({
  className,
  ...props
}: HTMLAttributes<HTMLDivElement>) => (
  <div
    className={twMerge('flex flex-col space-y-1.5 p-6', className)}
    {...props}
  />
);

const CardTitle = ({
  className,
  ...props
}: HTMLAttributes<HTMLHeadingElement>) => (
  <h3
    className={twMerge(
      'text-2xl font-semibold leading-none tracking-tight',
      className
    )}
    {...props}
  />
);

const CardDescription = ({
  className,
  ...props
}: HTMLAttributes<HTMLParagraphElement>) => (
  <p
    className={twMerge('text-sm text-muted-foreground', className)}
    {...props}
  />
);

const CardContent = ({
  className,
  ...props
}: HTMLAttributes<HTMLDivElement>) => (
  <div className={twMerge('p-6 pt-0', className)} {...props} />
);

const CardFooter = ({
  className,
  ...props
}: HTMLAttributes<HTMLDivElement>) => (
  <div
    className={twMerge('flex items-center p-6 pt-0', className)}
    {...props}
  />
);

export {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
};
