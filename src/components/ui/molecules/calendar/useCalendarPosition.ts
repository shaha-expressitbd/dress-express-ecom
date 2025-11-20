import { useEffect, useState } from "react";

interface UseCalendarPositionProps {
  isCalendarOpen: boolean;
  viewMode: "date" | "month" | "year";
  dualMonth: boolean;
  isMobile: boolean;
  position: "auto" | "top" | "bottom";
  containerRef: React.RefObject<HTMLDivElement>;
  dropdownRef: React.RefObject<HTMLDivElement>;
  backdropRef: React.RefObject<HTMLDivElement>;
}

export const useCalendarPosition = ({
  isCalendarOpen,
  viewMode,
  dualMonth,
  isMobile,
  position,
  containerRef,
  dropdownRef,
}: UseCalendarPositionProps) => {
  const [dropdownPosition, setDropdownPosition] = useState({
    top: 0,
    left: 0,
    width: 0,
    isAbove: false,
  });

  useEffect(() => {
    if (isCalendarOpen && containerRef.current) {
      const calculatePosition = () => {
        const rect = containerRef.current?.getBoundingClientRect();
        if (!rect) return;

        const viewportHeight = window.innerHeight;
        const viewportWidth = window.innerWidth;
        const gap = 8;

        // Calculate calendar height based on actual DOM element or use estimated height
        const calendarHeight =
          dropdownRef.current?.offsetHeight || (viewMode === "date" ? (dualMonth ? 400 : 350) : 300);

        // Calculate calendar width - account for dual month if needed
        const calendarWidth = dropdownRef.current?.offsetWidth || (dualMonth ? 580 : 280);

        if (isMobile) {
          setDropdownPosition({
            top: window.scrollY + 20,
            left: window.scrollX + 16,
            width: viewportWidth - 32,
            isAbove: false,
          });
        } else {
          const spaceBelow = viewportHeight - rect.bottom;
          const spaceAbove = rect.top;
          const isAbove =
            position === "top" || (position === "auto" && (spaceBelow < calendarHeight || spaceAbove > spaceBelow));

          // Vertical positioning
          const viewportTop = window.scrollY;
          const baseTop = rect.top + window.scrollY - calendarHeight - gap;
          const clampedTop = Math.max(baseTop, viewportTop + gap);

          // Horizontal positioning - improved to prevent overflow
          // Check if the dropdown would go off the right edge of the viewport
          const rightEdgeOfDropdown = rect.left + calendarWidth;
          const willOverflowRight = rightEdgeOfDropdown > viewportWidth;

          let left = rect.left + window.scrollX;
          // If dropdown would overflow right edge, adjust it to align right with the trigger
          if (willOverflowRight) {
            left = rect.right - calendarWidth + window.scrollX;
          }

          // Ensure dropdown doesn't go off left edge
          left = Math.max(gap + window.scrollX, left);

          setDropdownPosition({
            top: isAbove ? clampedTop : rect.bottom + window.scrollY + gap,
            left: left,
            width: rect.width,
            isAbove,
          });
        }
      };

      calculatePosition();

      // Recalculate on resize to handle viewport changes
      window.addEventListener("resize", calculatePosition);
      return () => window.removeEventListener("resize", calculatePosition);
    }
  }, [isCalendarOpen, position, viewMode, dualMonth, isMobile, containerRef, dropdownRef]);

  return dropdownPosition;
};
