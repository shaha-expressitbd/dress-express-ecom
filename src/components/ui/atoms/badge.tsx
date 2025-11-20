// components/ui/badge.tsx
import { ReactNode } from 'react'
import { twMerge } from 'tailwind-merge'

interface BadgeProps {
  children: ReactNode
  variant?:
    | 'default'
    | 'blue'
    | 'orange'
    | 'purple'
    | 'green'
    | 'red'
    | 'yellow'
    | 'gray'
  className?: string
}

export const Badge = ({
  children,
  variant = 'default',
  className = '',
}: BadgeProps) => {
  const baseClasses =
    'inline-flex items-center rounded-full px-2 py-1 text-xs font-medium text-nowrap'

  const variantClasses = {
    default: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200',
    blue: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
    purple:
      'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300',
    green:
      'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
    red: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300',
    yellow:
      'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300',
    gray: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200',
    orange:
      'bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-300',
  }

  return (
    <span className={twMerge(baseClasses, variantClasses[variant], className)}>
      {children}
    </span>
  )
}

interface StatusBadgeProps {
  isActive: boolean
  activeText?: string
  inactiveText?: string
  className?: string
}

export const StatusBadge = ({
  isActive,
  activeText = 'Active',
  inactiveText = 'Inactive',
  className = '',
}: StatusBadgeProps) => {
  return (
    <Badge variant={isActive ? 'green' : 'red'} className={className}>
      {isActive ? activeText : inactiveText}
    </Badge>
  )
}

interface PriceBadgeProps {
  value: number | string
  label: string
  variant?: 'blue' | 'purple' | 'green' | 'red' | 'yellow' | 'gray' | 'orange'
  currency?: string
  className?: string
}

export const PriceBadge = ({
  value,
  label,
  variant = 'orange',
  currency = '৳',
  className,
}: PriceBadgeProps) => {
  return (
    <Badge variant={variant} className={twMerge(className, 'flex gap-1 w-fit')}>
      <span>
        {label}: {value}
      </span>
      <span>{currency}</span>
    </Badge>
  )
}
