/* eslint-disable @next/next/no-img-element */
import React, { useState } from 'react'
import { twMerge } from 'tailwind-merge'

interface ImageProps {
  src: string
  alt: string
  className?: string
  srcSet?: Array<{
    src: string
    width: number
    breakpoint: number
  }>
  sizes?: string
  width?: number | string
  height?: number | string
  rounded?: 'none' | 'sm' | 'md' | 'lg' | 'full'
  objectFit?: 'contain' | 'cover' | 'fill' | 'none' | 'scale-down'
  loading?: 'eager' | 'lazy'
  decoding?: 'sync' | 'async' | 'auto'
  onClick?: () => void
  role?: string
  tabIndex?: number
  onError?: React.ReactEventHandler<HTMLImageElement>
}

const Image: React.FC<ImageProps> = ({
  src,
  alt,
  className,
  width,
  height,
  srcSet,
  sizes,
  rounded = 'none',
  objectFit = 'cover',
  loading = 'lazy',
  decoding = 'async',
  onClick,
  role,
  tabIndex,
  onError,
  ...props
}) => {
  const [isLoading, setIsLoading] = useState(true)
  const [fallbackSrc, setFallbackSrc] = useState(src)

  const handleLoad = () => {
    setIsLoading(false)
  }

  const handleError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    setIsLoading(false)
    // Fallback to `src` if `srcSet` fails
    if (fallbackSrc !== src) {
      setFallbackSrc(src)
    }
    onError?.(e)
  }

  const roundedClass = {
    none: 'rounded-none',
    sm: 'rounded-sm',
    md: 'rounded-md',
    lg: 'rounded-lg',
    full: 'rounded-full',
  }[rounded]

  const objectFitClass = {
    contain: 'object-contain',
    cover: 'object-cover',
    fill: 'object-fill',
    none: 'object-none',
    'scale-down': 'object-scale-down',
  }[objectFit]

  const generatedSrcSet = srcSet
    ?.map((item) => `${item.src} ${item.width}w`)
    .join(', ')

  const generateDefaultSizes = () => {
    if (!srcSet) return '100vw'
    const breakpoints = srcSet
      .map((item) => item.breakpoint)
      .sort((a, b) => a - b)
    const maxBreakpoint = breakpoints[breakpoints.length - 1]
    return `(max-width: ${maxBreakpoint}px) 100vw, ${maxBreakpoint}px`
  }

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' || event.key === ' ') {
      onClick?.()
    }
  }

  return (
    <div
      className={twMerge('relative', className, onClick && 'cursor-pointer')}
      style={{ width, height }}
      onClick={onClick}
      onKeyDown={onClick ? handleKeyDown : undefined}
      role={role}
      tabIndex={tabIndex}
    >
      {/* Image Element */}

      <img
        src={fallbackSrc}
        alt={alt}
        srcSet={fallbackSrc === src ? undefined : generatedSrcSet}
        sizes={
          fallbackSrc === src ? undefined : sizes || generateDefaultSizes()
        }
        className={twMerge(
          'h-auto transition-opacity duration-200',
          roundedClass,
          objectFitClass,
          isLoading ? 'opacity-0' : 'opacity-100',
          onClick &&
          'focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2'
        )}
        style={{
          width: '100%',
          height: '100%',
          ...(width && !height ? { height: 'auto' } : {}),
          ...(height && !width ? { width: 'auto' } : {}),
        }}
        loading={loading}
        decoding={decoding}
        onLoad={handleLoad}
        onError={handleError}
        {...props}
      />
    </div>
  )
}

export default Image
