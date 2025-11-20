import { useSidebar } from "@/hooks/useSidebar";
import { AnimatePresence, motion } from "framer-motion";
import { HiBars3, HiMiniBars3CenterLeft } from "react-icons/hi2";

export const SidebarToggler = () => {
  const { isSidebarOpen, toggle } = useSidebar();

  const handleClick = () => {
    toggle();
  };

  return (
    <div>
      <button
        id='sidebar-toggler'
        title={isSidebarOpen ? "Collapse Sidebar" : "Expand Sidebar"}
        onClick={handleClick}
        className='flex items-center cursor-pointer text-black dark:text-white '
      >
        <AnimatePresence mode='wait'>
          {isSidebarOpen ? (
            <motion.div
              key='fold'
              initial={{ opacity: 0, scale: 0.7, x: 10 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              exit={{ opacity: 0, scale: 0.7, x: -10 }}
              transition={{ duration: 0.2, ease: "easeInOut" }}
            >
              <HiMiniBars3CenterLeft className='text-2xl' />
            </motion.div>
          ) : (
            <motion.div
              key='unfold'
              initial={{ opacity: 0, scale: 0.7, x: -10 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              exit={{ opacity: 0, scale: 0.7, x: 10 }}
              transition={{ duration: 0.2, ease: "easeInOut" }}
            >
              <HiBars3 className='text-2xl' />
            </motion.div>
          )}
        </AnimatePresence>
      </button>
    </div>
  );
};
