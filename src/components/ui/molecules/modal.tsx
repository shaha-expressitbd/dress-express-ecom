import { AnimatePresence, motion } from "framer-motion";
import React, { useEffect, useRef, useState } from "react";
import ReactDOM from "react-dom";
import { FiX } from "react-icons/fi";
import { twMerge } from "tailwind-merge";
import { Button } from "../atoms/button";

type ModalSize = "sm" | "md" | "lg" | "xl";

interface ModalProps {
  isModalOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  showHeader?: boolean;
  showFooter?: boolean;
  onConfirm?: () => void;
  confirmText?: string;
  className?: string;
  size?: ModalSize;
  disableClickOutside?: boolean;
}

const sizeClasses = {
  sm: "max-w-sm",
  md: "max-w-md",
  lg: "max-w-lg",
  xl: "max-w-xl",
};

const Modal: React.FC<ModalProps> = ({
  isModalOpen,
  onClose,
  title,
  children,
  showHeader = true,
  showFooter = true,
  onConfirm,
  confirmText = "Confirm",
  className,
  size = "md",
  disableClickOutside = false,
}) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const [portalElement, setPortalElement] = useState<HTMLElement | null>(null);

  // Create portal element and add to DOM
  useEffect(() => {
    const element = document.createElement("div");
    element.id = "modal-portal";
    document.body.appendChild(element);
    setPortalElement(element);

    return () => {
      document.body.removeChild(element);
    };
  }, []);

  // Focus management
  useEffect(() => {
    if (isModalOpen) {
      document.body.style.overflow = "hidden";
      const focusableElements = modalRef.current?.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      const firstElement = focusableElements?.[0] as HTMLElement;
      firstElement?.focus();
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [isModalOpen]);

  useEffect(() => {
    // Event handlers
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    const handleClickOutside = (e: MouseEvent) => {
      if (!disableClickOutside && modalRef.current && !modalRef.current.contains(e.target as Node)) {
        onClose();
      }
    };

    if (isModalOpen) {
      document.addEventListener("keydown", handleKeyDown);
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClose, disableClickOutside, isModalOpen]);

  if (!portalElement) return null;

  return ReactDOM.createPortal(
    <AnimatePresence>
      {isModalOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className='fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80'
        >
          <motion.div
            ref={modalRef}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -20, opacity: 0 }}
            transition={{ type: "spring", damping: 25 }}
            role='dialog'
            aria-modal='true'
            aria-labelledby='modal-title'
            className={twMerge(
              "relative bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-h-[90vh] flex flex-col",
              sizeClasses[size],
              className
            )}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            {showHeader && (
              <div className='flex items-center justify-between p-4 bg-primary rounded-t-lg'>
                <h2 id='modal-title' className='text-xl font-semibold text-white'>
                  {title}
                </h2>
                <Button
                  title='Close'
                  aria-label='Close modal'
                  onClick={onClose}
                  className='text-white hover:bg-primary/80'
                >
                  <FiX size={24} />
                </Button>
              </div>
            )}

            {/* Content */}
            <div className='flex-1 p-6 overflow-y-auto scrollbar-thin'>{children}</div>

            {/* Footer */}
            {showFooter && (
              <div className='flex justify-end gap-3 p-2 bg-gray-50 dark:bg-gray-700 rounded-b-lg'>
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
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    portalElement
  );
};

export default Modal;
