import React from "react";
import { FiCalendar, FiX } from "react-icons/fi";
import { twMerge } from "tailwind-merge";

interface CalendarTriggerProps {
  id: string;
  selectedDates: Date[];
  placeholder: string;
  isCalendarOpen: boolean;
  error?: string;
  disabled?: boolean;
  className?: string;
  onToggleCalendar: () => void;
  onClearAll: (e: React.MouseEvent) => void;
  formatSelectedDates: () => string;
}

export const CalendarTrigger = React.forwardRef<HTMLDivElement, CalendarTriggerProps>(
  (
    {
      id,
      selectedDates,
      placeholder,
      isCalendarOpen,
      error,
      disabled,
      className,
      onToggleCalendar,
      onClearAll,
      formatSelectedDates,
    },
    ref
  ) => {
    return (
      <div
        id={id}
        ref={ref}
        onClick={onToggleCalendar}
        className={twMerge(
          "w-full flex items-center px-3 py-2 h-10 rounded border bg-white dark:bg-gray-800 text-gray-900 dark:text-white",
          "cursor-pointer select-none text-xs md:text-sm",
          "border-gray-300 dark:border-gray-600 hover:border-orange-400 dark:hover:border-orange-400 focus:outline-none",
          isCalendarOpen && "ring-2 ring-orange-300 dark:ring-primary",
          error && "border-red-500",
          disabled && "opacity-50 cursor-not-allowed",
          className
        )}
      >
        <div className='flex-1 truncate'>
          {selectedDates.length > 0 ? formatSelectedDates() : <span className='text-gray-400 '>{placeholder}</span>}
        </div>

        {selectedDates.length > 0 && !disabled && (
          <FiX className='ml-2 w-4 h-4 text-gray-400 dark:text-white hover:text-red-500 cursor-pointer' onClick={onClearAll} />
        )}
        <FiCalendar className='ml-2 w-4 h-4 text-gray-400 dark:text-white' />
      </div>
    );
  }
);

CalendarTrigger.displayName = "CalendarTrigger";
