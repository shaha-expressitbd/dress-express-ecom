import React from "react";
import { twMerge } from "tailwind-merge";

interface CalendarYearViewProps {
  currentDate: Date;
  error?: string;
  disabled?: boolean;
  onViewModeChange: (mode: "date" | "month" | "year") => void;
}

export const CalendarYearView: React.FC<CalendarYearViewProps> = ({
  currentDate,
  error,
  disabled,
  onViewModeChange,
}) => {
  const startYear = Math.floor(currentDate.getFullYear() / 10) * 10 - 1;
  const years = Array.from({ length: 12 }, (_, i) => startYear + i);

  return (
    <div className='grid grid-cols-4 gap-1 p-1'>
      {years.map((year) => {
        const isCurrentYear = currentDate.getFullYear() === year;
        return (
          <button
            key={year}
            type='button'
            className={twMerge(
              "p-1 rounded text-center text-xs md:text-sm transition-colors",
              isCurrentYear
                ? error
                  ? "bg-red-600 text-white"
                  : "bg-orange-600 text-white"
                : "hover:bg-gray-100 dark:hover:bg-gray-700",
              disabled && "opacity-50 cursor-not-allowed"
            )}
            onClick={() => {
              if (disabled) return;
              onViewModeChange("month");
            }}
            disabled={disabled}
          >
            {year}
          </button>
        );
      })}
    </div>
  );
};
