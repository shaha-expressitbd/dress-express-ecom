import React from 'react'
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi'
import { twMerge } from 'tailwind-merge'

interface CalendarHeaderProps {
  currentDate: Date
  viewMode: 'date' | 'month' | 'year'
  showMonthYearSelection: boolean
  error?: string
  disabled?: boolean
  dualMonth?: boolean
  onNavigatePrevious: () => void
  onNavigateNext: () => void
  onViewModeChange: (mode: 'date' | 'month' | 'year') => void
}

export const CalendarHeader: React.FC<CalendarHeaderProps> = ({
  currentDate,
  viewMode,
  showMonthYearSelection,
  error,
  disabled,
  dualMonth,
  onNavigatePrevious,
  onNavigateNext,
  onViewModeChange,
}) => {
  const getMonthYearLabel = (offset = 0) => {
    const date = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() + offset,
      1
    )
    return date.toLocaleString('default', { month: 'long', year: 'numeric' })
  }

  return (
    <div
      className={twMerge(
        'flex justify-between items-center p-2 sticky top-0 z-10',
        error ? 'bg-red-600 text-white' : 'bg-primary text-white'
      )}
    >
      <div className="flex items-center">
        <button
          onClick={onNavigatePrevious}
          className={twMerge(
            'p-1 rounded hover:bg-white/20 ml-2 transition',
            disabled && 'opacity-50 cursor-not-allowed'
          )}
          disabled={disabled}
          aria-label="Previous Month"
        >
          <FiChevronLeft className="w-5 h-5 opacity-70" />
        </button>
      </div>

      {showMonthYearSelection ? (
        <div className="flex flex-col items-center">
          {viewMode === 'date' && (
            <>
              {dualMonth ? (
                <div className="flex gap-2">
                  <button
                    onClick={() => !disabled && onViewModeChange('year')}
                    className="hover:underline"
                    disabled={disabled}
                  >
                    {getMonthYearLabel().split(' ')[1]}
                  </button>
                  <button
                    onClick={() => !disabled && onViewModeChange('month')}
                    className="hover:underline"
                    disabled={disabled}
                  >
                    {getMonthYearLabel().split(' ')[0]}-
                    {getMonthYearLabel(1).split(' ')[0]}
                  </button>
                </div>
              ) : (
                <div className="flex gap-2 items-center">
                  <button
                    onClick={() => !disabled && onViewModeChange('year')}
                    className="hover:underline"
                    disabled={disabled}
                  >
                    {getMonthYearLabel().split(' ')[1]}
                  </button>
                  <button
                    onClick={() => !disabled && onViewModeChange('month')}
                    className="hover:underline"
                    disabled={disabled}
                  >
                    {getMonthYearLabel().split(' ')[0]}
                  </button>
                </div>
              )}
            </>
          )}
          {viewMode === 'month' && (
            <button
              onClick={() => !disabled && onViewModeChange('year')}
              className="font-medium hover:underline"
              disabled={disabled}
            >
              {currentDate.getFullYear()}
            </button>
          )}
          {viewMode === 'year' && (
            <div className="font-medium">
              {`${Math.floor(currentDate.getFullYear() / 10) * 10 - 1} - ${
                Math.floor(currentDate.getFullYear() / 10) * 10 + 10
              }`}
            </div>
          )}
        </div>
      ) : (
        <div className="font-medium">
          {dualMonth
            ? `${getMonthYearLabel().split(' ')[1]} ${
                getMonthYearLabel().split(' ')[0]
              }-${getMonthYearLabel(1).split(' ')[0]}`
            : `${getMonthYearLabel().split(' ')[1]} ${
                getMonthYearLabel().split(' ')[0]
              }`}
        </div>
      )}

      <div className="flex items-center">
        {
          <button
            onClick={onNavigateNext}
            className={twMerge(
              'p-1 rounded hover:bg-white/20 mr-2 transition',
              disabled && 'opacity-50 cursor-not-allowed'
            )}
            disabled={disabled}
            aria-label="Next Month"
          >
            <FiChevronRight className="w-5 h-5 opacity-70" />
          </button>
        }
      </div>
    </div>
  )
}
