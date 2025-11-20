import { AnimatePresence, motion } from "framer-motion";
import React, { createContext, ReactNode, useContext, useState } from "react";
import { twMerge } from "tailwind-merge";

interface TabsContextType {
  activeTab: string;
  setActiveTab: (value: string, direction?: number) => void;
  direction: number;
}

const TabsContext = createContext<TabsContextType | undefined>(undefined);

interface TabsProps {
  defaultValue: string;
  children: ReactNode;
  className?: string;
}

const Tabs = ({ defaultValue, children, className }: TabsProps) => {
  const [activeTab, setActiveTab] = useState<string>(defaultValue);
  const [direction, setDirection] = useState<number>(1); // 1 for LTR, -1 for RTL

  const handleSetActiveTab = (value: string, newDirection?: number) => {
    const dir = newDirection !== undefined ? newDirection : value > activeTab ? 1 : -1;
    setDirection(dir);
    setActiveTab(value);
  };

  return (
    <TabsContext.Provider value={{ activeTab, setActiveTab: handleSetActiveTab, direction }}>
      <div className={twMerge("flex flex-col w-full gap-2", className)}>{children}</div>
    </TabsContext.Provider>
  );
};

interface TabsListProps {
  children: ReactNode;
  className?: string;
}

const TabsList = ({ children, className }: TabsListProps) => {
  const context = useContext(TabsContext);
  if (!context) throw new Error("TabsList must be used within a Tabs component");
  const { activeTab } = context;

  return (
    <motion.div
      role='tablist'
      className={twMerge(
        "inline-flex h-12 items-center justify-start rounded bg-gradient-to-r from-gray-100/50 to-gray-200/50 dark:from-gray-800/50 dark:to-gray-900/50",
        "border border-gray-200 dark:border-gray-700 shadow-sm",
        className
      )}
      layout
    >
      {React.Children.map(children, (child) => {
        if (React.isValidElement<TabsTriggerProps>(child)) {
          return React.cloneElement(child, {
            isActive: child.props.value === activeTab,
          });
        }
        return child;
      })}
    </motion.div>
  );
};

interface TabsTriggerProps {
  value: string;
  children: ReactNode;
  className?: string;
  isActive?: boolean;
  disabled?: boolean;
}

const TabsTrigger = ({ value, children, className, isActive = false, disabled = false }: TabsTriggerProps) => {
  const context = useContext(TabsContext);
  if (!context) throw new Error("TabsTrigger must be used within a Tabs component");
  const { setActiveTab } = context;

  return (
    <motion.button
      role='tab'
      aria-selected={isActive}
      aria-controls={`tab-content-${value}`}
      disabled={disabled}
      onClick={() => setActiveTab(value, value > context.activeTab ? 1 : -1)}
      className={twMerge(
        "relative inline-flex items-center justify-center whitespace-nowrap rounded px-4 py-2 text-sm font-medium",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2",
        "disabled:pointer-events-none disabled:opacity-50",
        isActive
          ? "text-primary dark:text-primary-300"
          : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200",
        className
      )}
      whileHover={
        !disabled
          ? {
              scale: 1.05,
              transition: { duration: 0.15, ease: "easeOut" },
            }
          : {}
      }
      whileTap={
        !disabled
          ? {
              scale: 0.98,
              transition: { duration: 0.1, ease: "easeIn" },
            }
          : {}
      }
    >
      {children}
      {isActive && (
        <motion.div
          layoutId='activeTabIndicator'
          className='absolute bottom-0 left-0 right-0 h-0.5 bg-primary dark:bg-primary-300'
          initial={false}
          transition={{
            type: "spring",
            stiffness: 500,
            damping: 30,
            mass: 0.5,
          }}
        />
      )}
    </motion.button>
  );
};

interface TabsContentProps {
  value: string;
  children: ReactNode;
  className?: string;
}

const TabsContent = ({ value, children, className }: TabsContentProps) => {
  const context = useContext(TabsContext);
  if (!context) throw new Error("TabsContent must be used within a Tabs component");
  const { activeTab, direction } = context;

  return (
    <AnimatePresence custom={direction} mode='wait'>
      {activeTab === value && (
        <motion.div
          role='tabpanel'
          id={`tab-content-${value}`}
          aria-labelledby={`tab-trigger-${value}`}
          className={twMerge(
            "p-4 rounded bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50",
            className
          )}
          custom={direction}
          initial={{ opacity: 0, x: 50 * direction, filter: "blur(2px)" }}
          animate={{
            opacity: 1,
            x: 0,
            filter: "blur(0px)",
            transition: {
              duration: 0.3,
              ease: [0.22, 1, 0.36, 1],
              opacity: { duration: 0.2 },
            },
          }}
          exit={{
            opacity: 0,
            x: -50 * direction,
            filter: "blur(2px)",
            transition: {
              duration: 0.2,
              ease: "easeIn",
              opacity: { duration: 0.15 },
            },
          }}
          transition={{ duration: 0.3 }}
          key={value}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export { Tabs, TabsContent, TabsList, TabsTrigger };
