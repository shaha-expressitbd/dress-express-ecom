import React from "react";
import { twMerge } from "tailwind-merge";

interface CalendarMonthViewProps {
  currentDate: Date;
  error?: string;
  disabled?: boolean;
  onViewModeChange: (mode: "date" | "month" | "year") => void;
}

export const CalendarMonthView: React.FC<CalendarMonthViewProps> = ({
  currentDate,
  error,
  disabled,
  onViewModeChange,
}) => {
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  return (
    <div className='grid grid-cols-3 gap-1 p-1'>
      {months.map((month, index) => {
        const isCurrentMonth = currentDate.getMonth() === index;
        return (
          <button
            key={month}
            type='button'
            className={twMerge(
              "p-1 rounded text-center text-xs md:text-sm transition-colors",
              isCurrentMonth
                ? error
                  ? "bg-red-600 text-white"
                  : "bg-primary text-white"
                : "hover:bg-gray-100 dark:hover:bg-gray-700",
              disabled && "opacity-50 cursor-not-allowed"
            )}
            onClick={() => {
              if (disabled) return;
              onViewModeChange("date");
            }}
            disabled={disabled}
          >
            {month.substring(0, 3)}
          </button>
        );
      })}
    </div>
  );
};
