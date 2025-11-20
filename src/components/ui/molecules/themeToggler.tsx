"use client";
import useTheme from "@/hooks/useTheme";
import React from "react";
import { FaMoon, FaSun } from "react-icons/fa";
import { Button } from "../atoms/button";

const ThemeToggler: React.FC = () => {
  const { mode, toggleMode } = useTheme();

  return (
    <Button
      title='Theme Toggler'
      variant='ghost'
      onClick={toggleMode}
      className='p-2 rounded-full bg-gray-100 dark:bg-gray-900 hover:bg-gray-300 dark:hover:bg-gray-700 transition-colors duration-200'
    >
      {mode === "light" ? (
        <FaMoon className='w-5 h-5 text-gray-700 dark:text-gray-300' />
      ) : (
        <FaSun className='w-5 h-5 text-yellow-500 dark:text-yellow-300' />
      )}
    </Button>
  );
};

export default ThemeToggler;
