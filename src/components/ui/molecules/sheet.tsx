"use client";
import { AnimatePresence, motion } from "framer-motion";
import React, { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { FiX } from "react-icons/fi";
import { twMerge } from "tailwind-merge";
import { Button } from "../atoms/button";

type SheetPosition = "left" | "right" | "top" | "bottom";
type SheetSize = "sm" | "md" | "lg" | "full";

interface SheetProps {
  isOpen: boolean;
  onClose?: () => void;
  position?: SheetPosition;
  children: React.ReactNode;
  className?: string;
  size?: SheetSize;
  disableClickOutside?: boolean;
  showCloseButton?: boolean;
  showHeader?: boolean;
  showFooter?: boolean;
  title?: string;
  onConfirm?: () => void;
  confirmText?: string;
  disableEscapeKey?: boolean;
  overlayClassName?: string;
  preventScroll?: boolean;
  initialFocusRef?: React.RefObject<HTMLElement>;
}

const positionClasses = {
  left: "left-0 top-0 h-full",
  right: "right-0 top-0 h-full",
  top: "top-0 left-0 w-full",
  bottom: "bottom-0 left-0 w-full",
};

const Sheet: React.FC<SheetProps> = ({
  isOpen,
  onClose,
  position = "right",
  children,
  className = "",
  disableClickOutside = false,
  showCloseButton = true,

  showHeader = true,
  showFooter = false,
  title,
  // onConfirm,
  // confirmText = "Confirm",
  disableEscapeKey = false,
  overlayClassName = "",
  preventScroll = true,
  initialFocusRef,
}) => {
  const sheetRef = useRef<HTMLDivElement>(null);

  // Prevent body scrolling when sheet is open
  useEffect(() => {
    if (preventScroll) {
      if (isOpen) {
        document.body.style.overflow = "hidden";
      } else {
        document.body.style.overflow = "";
      }
    }

    return () => {
      if (preventScroll) {
        document.body.style.overflow = "";
      }
    };
  }, [isOpen, preventScroll]);

  // Handle escape key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen && !disableEscapeKey) {
        onClose?.(); // Optional chaining ensures safe invocation
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose, disableEscapeKey]);

  // Handle click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (!disableClickOutside && sheetRef.current && !sheetRef.current.contains(e.target as Node)) {
        onClose?.(); // Optional chaining ensures safe invocation
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose, disableClickOutside]);
  // Handle click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (!disableClickOutside && sheetRef.current && !sheetRef.current.contains(e.target as Node)) {
        onClose?.(); // Optional chaining ensures safe invocation
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose, disableClickOutside]);

  if (typeof document === "undefined") return null;

  const getAnimationProps = () => {
    switch (position) {
      case "left":
        return { initial: { x: "-100%" }, animate: { x: 0 }, exit: { x: "-100%" } };
      case "right":
        return { initial: { x: "100%" }, animate: { x: 0 }, exit: { x: "100%" } };
      case "top":
        return { initial: { y: "-100%" }, animate: { y: 0 }, exit: { y: "-100%" } };
      case "bottom":
        return { initial: { y: "100%" }, animate: { y: 0 }, exit: { y: "100%" } };
      default:
        return { initial: { x: "100%" }, animate: { x: 0 }, exit: { x: "100%" } };
    }
  };

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className={twMerge("fixed inset-0 z-40 bg-black/50 backdrop-blur-sm", overlayClassName)}
            onClick={disableClickOutside ? undefined : onClose}
          />

          {/* Sheet */}
          <motion.div
            {...getAnimationProps()}
            ref={sheetRef}
            transition={{ type: "spring", damping: 25, stiffness: 400 }}
            role='dialog'
            aria-modal='true'
            aria-labelledby={title ? "sheet-title" : undefined}
            className={twMerge(
              "fixed z-[10000] bg-white dark:bg-gray-800 w-fit",
              position === "left" || position === "right" ? "h-svh" : "w-full",
              positionClasses[position],
              className
            )}
            onClick={(e) => e.stopPropagation()}
          >
            <div className='w-full'>
              {showHeader && (
                <SheetHeader
                  onClose={onClose}
                  showCloseButton={showCloseButton}
                  className={position === "bottom" ? "order-last" : ""}
                >
                  {title && (
                    <h2 id='sheet-title' className='text-xl font-semibold'>
                      {title}
                    </h2>
                  )}
                </SheetHeader>
              )}

              <SheetContent>{children}</SheetContent>

              {showFooter && (
                <SheetFooter>
                  {/* <div className='flex justify-end gap-3'>
                    <Button title='Cancel' variant='outline' size='md' onClick={onClose}>
                      Cancel
                    </Button>
                    {onConfirm && (
                      <Button
                        title='Confirm'
                        size='md'
                        onClick={() => {
                          onConfirm();
                          onClose();
                        }}
                      >
                        {confirmText}
                      </Button>
                    )}
                  </div> */}
                  {children}
                </SheetFooter>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>,
    document.body
  );
};

interface SheetHeaderProps {
  children: React.ReactNode;
  className?: string;
  showCloseButton?: boolean;
  onClose?: () => void;
}

const SheetHeader = ({ children, className = "", showCloseButton = true, onClose }: SheetHeaderProps) => {
  return (
    <header
      className={twMerge(
        "z-50 w-full flex items-center justify-between border-b dark:border-gray-700 bg-white dark:bg-gray-800",
        className
      )}
    >
      <div className='flex-1'>{children}</div>
      {showCloseButton && onClose && (
        <Button title='Close' aria-label='Close sheet' onClick={onClose} variant='ghost' className='rounded-full'>
          <FiX size={20} />
        </Button>
      )}
    </header>
  );
};

interface SheetContentProps {
  children: React.ReactNode;
  className?: string;
}

const SheetContent = ({ children, className = "" }: SheetContentProps) => {
  return <div className={twMerge(" flex-1 overflow-y-aut scrollbar-thin", className)}>{children}</div>;
};

interface SheetFooterProps {
  children: React.ReactNode;
  className?: string;
}

const SheetFooter = ({ children, className = "" }: SheetFooterProps) => {
  return (
    <footer
      className={twMerge(
        "absolute bottom-0 w-full border-t p-0 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/50",
        className
      )}
    >
      {children}
    </footer>
  );
};

export { Sheet, SheetContent, SheetFooter, SheetHeader };
