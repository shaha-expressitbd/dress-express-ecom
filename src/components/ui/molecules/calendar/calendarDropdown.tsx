import { forwardRef } from "react";
import { createPortal } from "react-dom";
import { twMerge } from "tailwind-merge";
import { CalendarDateView } from "./CalendarDateView";
import { CalendarHeader } from "./calendarHeader";
import { CalendarMonthView } from "./CalendarMonthView";
import { CalendarYearView } from "./CalendarYearView";

interface CalendarDropdownProps {
  isMobile: boolean;
  dualMonth: boolean;
  error?: string;
  disabled?: boolean;
  dropdownPosition: {
    top: number;
    left: number;
    width: number;
    isAbove: boolean;
  };
  currentDate: Date;
  viewMode: "date" | "month" | "year";
  showMonthYearSelection: boolean;
  selectedDates: Date[];
  tempStartDate: Date | null;
  hoveredDate: Date | null;
  mode: "single" | "multi" | "range";
  onDateClick: (date: Date) => void;
  onHoverDate: (date: Date | null) => void;
  onNavigatePrevious: () => void;
  onNavigateNext: () => void;
  onViewModeChange: (mode: "date" | "month" | "year") => void;
  onClose: () => void;
}

export const CalendarDropdown = forwardRef<HTMLDivElement, CalendarDropdownProps>(
  (
    {
      isMobile,
      dualMonth,
      error,
      disabled,
      dropdownPosition,
      currentDate,
      viewMode,
      showMonthYearSelection,
      selectedDates,
      tempStartDate,
      hoveredDate,
      mode,
      onDateClick,
      onHoverDate,
      onNavigatePrevious,
      onNavigateNext,
      onViewModeChange,
      onClose,
    },
    ref
  ) => {
    // For mobile devices, render a centered modal
    if (isMobile) {
      return createPortal(
        <>
          <div className='fixed inset-0 z-[9998] bg-black bg-opacity-50' onClick={onClose} />
          <div
            ref={ref}
            className={twMerge(
              "z-[9999] bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 shadow-lg rounded-md",
              "fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[calc(100%-32px)] max-h-[80vh] overflow-y-auto"
            )}
          >
            <CalendarHeader
              currentDate={currentDate}
              viewMode={viewMode}
              showMonthYearSelection={showMonthYearSelection}
              error={error}
              disabled={disabled}
              dualMonth={dualMonth}
              onNavigatePrevious={onNavigatePrevious}
              onNavigateNext={onNavigateNext}
              onViewModeChange={onViewModeChange}
            />
            <div className='p-2'>
              {viewMode === "date" && (
                <CalendarDateView
                  currentDate={currentDate}
                  selectedDates={selectedDates}
                  tempStartDate={tempStartDate}
                  hoveredDate={hoveredDate}
                  mode={mode}
                  error={error}
                  disabled={disabled}
                  dualMonth={dualMonth}
                  onDateClick={onDateClick}
                  onHoverDate={onHoverDate}
                  isMobile={isMobile}
                />
              )}
              {viewMode === "month" && (
                <CalendarMonthView
                  currentDate={currentDate}
                  error={error}
                  disabled={disabled}
                  onViewModeChange={onViewModeChange}
                />
              )}
              {viewMode === "year" && (
                <CalendarYearView
                  currentDate={currentDate}
                  error={error}
                  disabled={disabled}
                  onViewModeChange={onViewModeChange}
                />
              )}
            </div>
          </div>
        </>,
        document.body
      );
    }

    // For desktop devices, render a positioned dropdown
    return createPortal(
      <div
        ref={ref}
        className={twMerge(
          "z-[9999] bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 shadow-lg rounded-md",
          dualMonth ? "min-w-[580px] absolute" : "min-w-[280px] absolute"
        )}
        style={{
          top: `${dropdownPosition.top}px`,
          left: `${dropdownPosition.left}px`,
          width: dualMonth ? "auto" : `${dropdownPosition.width}px`, // Allow dual month to use its natural width
        }}
      >
        <CalendarHeader
          currentDate={currentDate}
          viewMode={viewMode}
          showMonthYearSelection={showMonthYearSelection}
          error={error}
          disabled={disabled}
          dualMonth={dualMonth}
          onNavigatePrevious={onNavigatePrevious}
          onNavigateNext={onNavigateNext}
          onViewModeChange={onViewModeChange}
        />
        <div className='p-2'>
          {viewMode === "date" && (
            <CalendarDateView
              currentDate={currentDate}
              selectedDates={selectedDates}
              tempStartDate={tempStartDate}
              hoveredDate={hoveredDate}
              mode={mode}
              error={error}
              disabled={disabled}
              dualMonth={dualMonth}
              onDateClick={onDateClick}
              onHoverDate={onHoverDate}
              isMobile={isMobile}
            />
          )}
          {viewMode === "month" && (
            <CalendarMonthView
              currentDate={currentDate}
              error={error}
              disabled={disabled}
              onViewModeChange={onViewModeChange}
            />
          )}
          {viewMode === "year" && (
            <CalendarYearView
              currentDate={currentDate}
              error={error}
              disabled={disabled}
              onViewModeChange={onViewModeChange}
            />
          )}
        </div>
      </div>,
      document.body
    );
  }
);

CalendarDropdown.displayName = "CalendarDropdown";
