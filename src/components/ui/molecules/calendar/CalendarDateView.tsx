import React from 'react'
import { twMerge } from 'tailwind-merge'

interface CalendarDateViewProps {
  currentDate: Date
  selectedDates: Date[]
  tempStartDate: Date | null
  hoveredDate: Date | null
  mode: 'single' | 'multi' | 'range'
  error?: string
  disabled?: boolean
  dualMonth?: boolean
  onDateClick: (date: Date) => void
  onHoverDate: (date: Date | null) => void
  isMobile: boolean
}

export const CalendarDateView: React.FC<CalendarDateViewProps> = ({
  currentDate,
  selectedDates,
  tempStartDate,
  hoveredDate,
  mode,
  error,
  disabled,
  dualMonth,
  onDateClick,
  onHoverDate,
  isMobile,
}) => {
  const renderDaysForMonth = (monthOffset = 0) => {
    const days = []
    const monthDate = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() + monthOffset,
      1
    )
    const firstDayOfMonth = new Date(
      monthDate.getFullYear(),
      monthDate.getMonth(),
      1
    )
    const lastDayOfMonth = new Date(
      monthDate.getFullYear(),
      monthDate.getMonth() + 1,
      0
    )
    const startDay = firstDayOfMonth.getDay()
    const endDay = lastDayOfMonth.getDate()
    const today = new Date()
    today.setHours(0, 0, 0, 0) // Set to beginning of day for accurate comparison
    const todayString = today.toDateString()

    // Fill empty days
    for (let i = 0; i < startDay; i++) {
      days.push(
        <div key={`empty-${monthOffset}-${i}`} className="h-5 md:h-8" />
      )
    }

    // Render days with proper range highlighting
    for (let i = 1; i <= endDay; i++) {
      const date = new Date(monthDate.getFullYear(), monthDate.getMonth(), i)
      const isSelected = selectedDates.some(
        (d) => d.toDateString() === date.toDateString()
      )
      const isToday = date.toDateString() === todayString
      const isPastDate = date < today

      // Range selection logic
      let isInRange = false
      let isRangeStart = false
      let isRangeEnd = false

      if (mode === 'range') {
        if (selectedDates.length > 1) {
          isRangeStart = date.toDateString() === selectedDates[0].toDateString()
          isRangeEnd =
            date.toDateString() ===
            selectedDates[selectedDates.length - 1].toDateString()
          isInRange =
            date > selectedDates[0] &&
            date < selectedDates[selectedDates.length - 1]
        } else if (tempStartDate && hoveredDate) {
          const rangeStart =
            tempStartDate < hoveredDate ? tempStartDate : hoveredDate
          const rangeEnd =
            tempStartDate < hoveredDate ? hoveredDate : tempStartDate
          isRangeStart = date.toDateString() === rangeStart.toDateString()
          isRangeEnd = date.toDateString() === rangeEnd.toDateString()
          isInRange = date > rangeStart && date < rangeEnd
        }
      }

      const dayClass = twMerge(
        'min-h-4 h-8 min-w-4 w-8 aspect-square flex items-center justify-center rounded text-xs md:text-sm transition-colors',
        isToday && 'font-bold border border-primary dark:border-orange-400',
        isPastDate && 'line-through text-gray-400 dark:text-gray-300',
        isSelected && !isRangeStart && !isRangeEnd
          ? error
            ? 'bg-red-600 text-white'
            : 'bg-primary text-white'
          : isInRange
          ? error
            ? 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-200'
            : 'bg-orange-100 text-orange-800 dark:bg-orange-900/50 dark:text-orange-200'
          : 'hover:bg-gray-100 dark:hover:bg-gray-700',
        isRangeStart && 'bg-primary text-white',
        isRangeEnd && 'bg-primary text-white',
        isRangeStart && isRangeEnd && 'rounded',
        disabled && 'opacity-50 cursor-not-allowed'
      )

      days.push(
        <button
          key={`${monthOffset}-${i}`}
          type="button"
          className={dayClass}
          onClick={() => onDateClick(date)}
          onMouseEnter={() =>
            mode === 'range' && tempStartDate && onHoverDate(date)
          }
          disabled={disabled}
        >
          {i}
        </button>
      )
    }
    return days
  }

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
        'flex',
        dualMonth && 'gap-2',
        isMobile && 'flex-col gap-2'
      )}
    >
      {/* First Month */}
      <div className={'w-full'}>
        {dualMonth && (
          <div className="text-center font-medium mb-2 text-xs md:text-sm">
            {getMonthYearLabel()}
          </div>
        )}
        <div className="grid grid-cols-7 gap-1 mb-2">
          {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((day) => (
            <div
              key={day}
              className="text-center text-xs font-medium text-gray-500 dark:text-white h-6 flex items-center justify-center"
            >
              {day}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-1 dark:text-white">
          {renderDaysForMonth()}
        </div>
      </div>

      {/* Second Month (when dualMonth is true) */}
      {dualMonth && (
        <div className="w-full">
          <div className={dualMonth ? 'w-full' : ''}>
            {dualMonth && (
              <div className="text-center font-medium mb-2 text-xs md:text-sm">
                {getMonthYearLabel(1)}
              </div>
            )}
            <div className="grid grid-cols-7 gap-1 mb-2">
              {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((day) => (
                <div
                  key={`second-${day}`}
                  className="text-center text-xs font-medium text-gray-500 dark:text-gray-400 h-6 flex items-center justify-center"
                >
                  {day}
                </div>
              ))}
            </div>
            <div className="grid grid-cols-7 gap-1">
              {renderDaysForMonth(1)}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
