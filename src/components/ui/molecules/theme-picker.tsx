import useTheme from "@/hooks/useTheme";
import React from "react";
import { FaFire, FaLeaf, FaPaintBrush, FaTint } from "react-icons/fa";
import { Button } from "../atoms/button";
import { Icon } from "../atoms/icon";

type ThemeColor = "red" | "green" | "blue" | "sage";

const ThemeColorPicker: React.FC = () => {
  const { color, changeColor } = useTheme();

  const colors: { name: ThemeColor; icon: React.ReactNode }[] = [
    { name: "red", icon: <Icon icon={FaFire} className='text-red-500' /> },
    { name: "green", icon: <Icon icon={FaLeaf} className='text-green-500' /> },
    { name: "blue", icon: <Icon icon={FaTint} className='text-blue-500' /> },
    {
      name: "sage",
      icon: <Icon icon={FaPaintBrush} className='text-gray-500' />,
    },
  ];

  return (
    <div className='flex flex-col gap-2'>
      <div className='flex gap-2'>
        {colors.map((themeColor) => (
          <Button
            title='Theme Color Picker'
            key={themeColor.name}
            variant='ghost'
            onClick={() => changeColor(themeColor.name)}
            className={`p-2 rounded-full bg-gray-100 dark:bg-gray-900 hover:bg-gray-300 dark:hover:bg-gray-700 transition-colors duration-200 ${
              color === themeColor.name ? "border-2 border-black dark:border-white" : "border border-transparent"
            }`}
          >
            {themeColor.icon}
          </Button>
        ))}
      </div>
    </div>
  );
};

export default ThemeColorPicker;
