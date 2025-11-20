import React from "react";
import { twMerge } from "tailwind-merge";

interface PageTitleProps {
  title: string;
  className?: string;
  leftElement?: React.ReactNode;
  rightElement?: React.ReactNode;
}

const PageTitle = ({ title, className, leftElement, rightElement }: PageTitleProps) => {
  return (
    <div
      className={twMerge(
        "w-full  flex items-center justify-between px-4 py-3 rounded bg-white dark:bg-gray-700 border border-gray-300  dark:border-gray-600",
        className
      )}
    >
      <div className='flex items-center gap-2'>
        {leftElement}
        <h1
          className='text-lg md:text-lg font-medium whitespace-nowrap text-black dark:text-white'
          role='heading'
          aria-level={1}
        >
          {title}
        </h1>
      </div>
      {rightElement && <div className='flex-shrink-0'>{rightElement}</div>}
    </div>
  );
};

export default PageTitle;
