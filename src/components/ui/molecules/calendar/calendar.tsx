import React, { useCallback, useEffect, useRef, useState } from 'react'
import { FormFieldWrapper } from '../FormFieldWrapper'
import { CalendarDropdown } from './calendarDropdown'
import { CalendarTrigger } from './calendarTrigger'
import { useCalendarPosition } from './useCalendarPosition'
import { useWindowSize } from './useWindowSize'

type CalendarProps = {
  id: string
  label?: string
  mode?: 'single' | 'multi' | 'range'
  selectedDates?: Date[]
  onDateChange: (dates: Date[]) => void
  className?: string
  placeholder?: string
  position?: 'auto' | 'top' | 'bottom'
  error?: string
  warning?: string
  required?: boolean
  preserveErrorSpace?: boolean
  showError?: boolean
  labelRightElement?: React.ReactNode
  showMonthYearSelection?: boolean
  dualMonth?: boolean
  disabled?: boolean
  clearAllConfirmation?: string
}

const Calendar: React.FC<CalendarProps> = ({
  id,
  label,
  mode = 'single',
  selectedDates = [],
  onDateChange,
  className,
  placeholder = 'Select date',
  position = 'auto',
  error,
  showError = true,
  warning,
  required = false,
  preserveErrorSpace = true,
  labelRightElement,
  showMonthYearSelection = true,
  dualMonth = mode === 'range',
  disabled = false,
  clearAllConfirmation = 'Are you sure you want to clear all selections?',
}) => {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [tempStartDate, setTempStartDate] = useState<Date | null>(null)
  const [hoveredDate, setHoveredDate] = useState<Date | null>(null)
  const [viewMode, setViewMode] = useState<'date' | 'month' | 'year'>('date')
  const [isCalendarOpen, setIsCalendarOpen] = useState(false)

  const containerRef = useRef<HTMLDivElement>(null!)
  const dropdownRef = useRef<HTMLDivElement>(null!)
  const backdropRef = useRef<HTMLDivElement>(null!)

  const { width: windowWidth } = useWindowSize()
  const isMobile = windowWidth < 768
  const dropdownPosition = useCalendarPosition({
    isCalendarOpen,
    viewMode,
    dualMonth,
    isMobile,
    position,
    containerRef,
    dropdownRef,
    backdropRef,
  })

  const closeCalendar = useCallback(() => {
    setIsCalendarOpen(false)
    setViewMode('date')
    if (mode === 'range') {
      setTempStartDate(null)
      setHoveredDate(null)
    }
  }, [mode])

  // Handle outside clicks to close calendar
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        isCalendarOpen &&
        containerRef.current &&
        dropdownRef.current &&
        !containerRef.current.contains(event.target as Node) &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        closeCalendar()
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [isCalendarOpen, closeCalendar])

  const toggleCalendar = () => {
    if (disabled) return
    setIsCalendarOpen(!isCalendarOpen)
    if (!isCalendarOpen) setViewMode('date')
  }

  const handleClearAll = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (disabled) return
    if (!clearAllConfirmation || confirm(clearAllConfirmation)) {
      onDateChange([])
    }
  }

  const formatSelectedDates = () => {
    if (selectedDates.length === 0) return ''
    if (mode === 'single') {
      return selectedDates[0]?.toLocaleDateString() || ''
    }
    if (mode === 'multi') {
      return selectedDates.length === 1
        ? selectedDates[0].toLocaleDateString()
        : `${selectedDates.length} dates selected`
    }
    if (mode === 'range') {
      return selectedDates.length > 1
        ? `${selectedDates[0].toLocaleDateString()} - ${selectedDates[
            selectedDates.length - 1
          ].toLocaleDateString()}`
        : selectedDates[0]?.toLocaleDateString() || ''
    }
    return ''
  }

  const handleDateClick = (date: Date) => {
    if (disabled) return

    let newDates: Date[] = []
    if (mode === 'single') {
      newDates = [date]
      closeCalendar()
    } else if (mode === 'multi') {
      const isSelected = selectedDates.some(
        (d) => d.toDateString() === date.toDateString()
      )
      newDates = isSelected
        ? selectedDates.filter((d) => d.toDateString() !== date.toDateString())
        : [...selectedDates, date]
    } else if (mode === 'range') {
      if (!tempStartDate) {
        setTempStartDate(date)
        newDates = [date]
      } else {
        const start = tempStartDate < date ? tempStartDate : date
        const end = tempStartDate < date ? date : tempStartDate
        newDates = [start, end]
        closeCalendar()
      }
    }
    onDateChange(newDates)
  }

  // else if (mode === 'range') {
  //   if (!tempStartDate) {
  //     setTempStartDate(date)
  //     newDates = [date]
  //   } else {
  //     const start = tempStartDate < date ? tempStartDate : date
  //     const end = tempStartDate < date ? date : tempStartDate
  //     newDates = getDatesInRange(start, end)
  //     closeCalendar()
  //   }
  // }

  // const getDatesInRange = (start: Date, end: Date): Date[] => {
  //   const dates = []
  //   const current = new Date(start)
  //   while (current <= end) {
  //     dates.push(new Date(current))
  //     current.setDate(current.getDate() + 1)
  //   }
  //   return dates
  // }

  const navigatePrevious = () => {
    if (disabled) return
    if (viewMode === 'date') {
      setCurrentDate(
        new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1)
      )
    } else if (viewMode === 'month') {
      setCurrentDate(
        new Date(currentDate.getFullYear() - 1, currentDate.getMonth(), 1)
      )
    } else if (viewMode === 'year') {
      setCurrentDate(
        new Date(currentDate.getFullYear() - 12, currentDate.getMonth(), 1)
      )
    }
  }

  const navigateNext = () => {
    if (disabled) return
    if (viewMode === 'date') {
      setCurrentDate(
        new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1)
      )
    } else if (viewMode === 'month') {
      setCurrentDate(
        new Date(currentDate.getFullYear() + 1, currentDate.getMonth(), 1)
      )
    } else if (viewMode === 'year') {
      setCurrentDate(
        new Date(currentDate.getFullYear() + 12, currentDate.getMonth(), 1)
      )
    }
  }

  return (
    <FormFieldWrapper
      id={id}
      label={label}
      error={error}
      warning={warning}
      required={required}
      showError={showError}
      preserveErrorSpace={preserveErrorSpace}
      labelRightElement={labelRightElement}
    >
      <div className="relative" ref={containerRef}>
        <CalendarTrigger
          id={id}
          selectedDates={selectedDates}
          placeholder={placeholder}
          isCalendarOpen={isCalendarOpen}
          error={error}
          disabled={disabled}
          className={className}
          onToggleCalendar={toggleCalendar}
          onClearAll={handleClearAll}
          formatSelectedDates={formatSelectedDates}
        />

        {isCalendarOpen && (
          <CalendarDropdown
            ref={dropdownRef}
            isMobile={isMobile}
            dualMonth={dualMonth}
            error={error}
            disabled={disabled}
            dropdownPosition={dropdownPosition}
            currentDate={currentDate}
            viewMode={viewMode}
            showMonthYearSelection={showMonthYearSelection}
            selectedDates={selectedDates}
            tempStartDate={tempStartDate}
            hoveredDate={hoveredDate}
            mode={mode}
            onDateClick={handleDateClick}
            onHoverDate={setHoveredDate}
            onNavigatePrevious={navigatePrevious}
            onNavigateNext={navigateNext}
            onViewModeChange={setViewMode}
            onClose={closeCalendar}
          />
        )}
      </div>
    </FormFieldWrapper>
  )
}

export default Calendar
