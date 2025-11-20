import { AnimatePresence, motion } from "framer-motion";
import React, { useState } from "react";
import { twMerge } from "tailwind-merge";

interface TooltipProps {
  content: string;
  children: React.ReactNode;
  position?: "top" | "bottom" | "left" | "right";
  delay?: number;
  className?: string;
}

export const Tooltip: React.FC<TooltipProps> = ({
  content,
  children,
  className,
  position = "top",
  delay = 300,
}) => {
  const [isVisible, setIsVisible] = useState(false);

  // Tooltip position classes
  const positionClasses = {
    top: "bottom-full mb-2 left-1/2 transform -translate-x-1/2 text-center",
    bottom: "top-full mt-2 left-1/2 transform -translate-x-1/2 text-center",
    left: "right-full mr-2 top-1/2 transform -translate-y-1/2 ",
    right: "left-full ml-2 top-1/2 transform -translate-y-1/2",
  };

  return (
    <div
      className={`relative inline-block`}
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
    >
      {children}
      <AnimatePresence>
        {isVisible && (
          <motion.div
            className={twMerge(
              "absolute  min-w-fit px-2 py-1 text-sm text-white bg-gray-700 rounded-md shadow-lg z-50",
              positionClasses[position],
              className
            )}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.2, delay: delay / 1000 }}
          >
            {content}
            {/* Tooltip arrow */}
            <div
              className={`absolute w-2 h-2 bg-gray-700 transform rotate-45 ${
                position === "top"
                  ? "bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2"
                  : position === "bottom"
                  ? "top-0 left-1/2 -translate-x-1/2 -translate-y-1/2"
                  : position === "left"
                  ? "right-0 top-1/2 -translate-y-1/2 translate-x-1/2"
                  : "left-0 top-1/2 -translate-y-1/2 -translate-x-1/2"
              }`}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
