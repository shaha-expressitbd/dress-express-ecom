import React, { useState } from "react";

// Accordion Trigger Props
type AccordionTriggerProps = {
  children: React.ReactNode;
  onClick: () => void;
  isOpen: boolean;
};

// Accordion Content Props
type AccordionContentProps = {
  children: React.ReactNode;
  isOpen: boolean;
};

// Accordion Trigger Component
export const AccordionTrigger = ({
  children,
  onClick,
  isOpen,
}: AccordionTriggerProps) => {
  return (
    <div
      className="flex justify-between items-center cursor-pointer p-4 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
      onClick={onClick}
    >
      {children}
      <span className="transform transition-transform duration-200">
        {isOpen ? "▲" : "▼"}
      </span>
    </div>
  );
};

// Accordion Content Component
export const AccordionContent = ({
  children,
  isOpen,
}: AccordionContentProps) => {
  return (
    <div
      className={`overflow-hidden transition-all duration-200 ${
        isOpen ? "max-h-96" : "max-h-0"
      }`}
    >
      <div className="p-4 bg-white dark:bg-gray-700 rounded-b-lg">
        {children}
      </div>
    </div>
  );
};

// Main Accordion Component
type AccordionProps = {
  trigger: React.ReactNode;
  children: React.ReactNode;
};

export const Accordion = ({ trigger, children }: AccordionProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleAccordion = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="mb-2">
      <AccordionTrigger onClick={toggleAccordion} isOpen={isOpen}>
        {trigger}
      </AccordionTrigger>
      <AccordionContent isOpen={isOpen}>{children}</AccordionContent>
    </div>
  );
};
