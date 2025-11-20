'use client";';
import { motion } from "framer-motion";
import Image from "next/image";
import { FaBell } from "react-icons/fa";
import { Icon } from "../atoms/icon";
import { Dropdown, DropdownContent, DropdownTrigger } from "./dropdown";

interface Notification {
  id: number;
  date: string;
  time: string;
  name: string;
  message: string;
}

// const dotColors = ["bg-primary", "bg-green-500", "bg-purple-500", "bg-yellow-500", "bg-pink-500"];

interface NotificationsDropdownProps {
  notifications?: Notification[];
}

const NotificationsDropdown = ({ notifications = [] }: NotificationsDropdownProps) => {
  // const getDotColor = (index: number): string => {
  //   return dotColors[index % dotColors.length];
  // };

  // const [isOpen, setIsOpen] = useState(false);

  // const toggleDropdown = () => setIsOpen(!isOpen);

  return (
    <Dropdown align='right' className='relative'>
      <DropdownTrigger>
        <div className='p-2 rounded-full bg-gray-100 dark:bg-gray-900 hover:bg-gray-300 dark:hover:bg-gray-700 transition-colors duration-200'>
          <Icon icon={FaBell} size={20} />
          {notifications.length > 0 && (
            <span className='absolute -top-1 -right-1 bg-red-500  text-white text-xs rounded-full min-h-5 min-w-5 flex items-center justify-center'>
              {notifications.length > 9 ? "9+" : notifications.length}
            </span>
          )}
        </div>
      </DropdownTrigger>
      <DropdownContent className='w-fit sm:w-72 rounded-lg shadow-lg bg-white dark:bg-gray-700 fixed sm:absolute left-2 sm:left-auto right-2 sm:right-0 mt-2'>
        {/* <div className='flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700'>
          <h3 className='text-lg font-semibold text-gray-900 dark:text-gray-100'>
            Notifications
          </h3>
          <Link
            to={'/notifications'}
            className='text-primary hover:text-orange-600 dark:text-orange-400 dark:hover:text-orange-300 hover:underline text-nowrap'
          >
            View All
          </Link>
        </div>
        {notifications.length > 0 ? (
          <ul className=''>
            {notifications.map((notification, index) => (
              <li
                key={notification.id}
                className='relative p-4 pt-0 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors'
              >
                {index !== notifications.length - 1 && (
                  <div
                    className='absolute left-5 top-5 bottom-0 w-0.5 border-l-2 border-dashed border-gray-300 dark:border-gray-600'
                    aria-hidden='true'
                  ></div>
                )}
                <div className='flex space-x-3'>
                  <div className='flex-shrink-0'>
                    <div
                      className={`h-3 w-3 ${getDotColor(
                        index
                      )} rounded-full mt-2 shadow-glow`}
                    ></div>
                  </div>
                  <div className='flex-1'>
                    <div className='flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-1'>
                      <span>{notification.date}</span>
                      <span>{notification.time}</span>
                    </div>
                    <p className='font-semibold text-gray-900 dark:text-gray-100'>
                      {notification.name}
                    </p>
                    <p className='text-sm text-gray-600 dark:text-gray-300'>
                      {notification.message}
                    </p>
                  </div>
                  <div className='flex-shrink-0'>
                    <div
                      className={`h-3 w-3 ${getDotColor(
                        index
                      )} rounded-full mt-2 shadow-glow`}
                    ></div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className='text-sm text-gray-500 dark:text-gray-400 p-4'>
            No new notifications.
          </p>
        )} */}
        {/* Dropdown */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
        >
          <div
            className='absolute right-0 z-20 w-80 mt-2 bg-white divide-y divide-gray-100 rounded-lg shadow-sm dark:bg-gray-800 dark:divide-gray-700'
            aria-labelledby='dropdownNotificationButton'
          >
            <div className='block px-4 py-2 font-medium text-center text-gray-700 rounded-t-lg bg-gray-50 dark:bg-gray-800 dark:text-white'>
              Notifications
            </div>

            <div className='divide-y divide-gray-100 dark:divide-gray-700 max-h-96 overflow-y-auto'>
              {/* Example notification item */}
              <a href='#' className='flex px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-700 relative'>
                <div className='shrink-0'>
                  <Image
                    className='rounded-full w-10 h-10 object-cover'
                    src='https://avatar.iran.liara.run/150'
                    alt='Profile'
                    width={50}
                    height={50}
                  />
                  <div className='absolute flex items-center justify-center w-5 h-5 ms-6 -mt-5 bg-orange-600 border border-white rounded-full dark:border-gray-800'>
                    <svg
                      className='w-2 h-2 text-white'
                      aria-hidden='true'
                      xmlns='http://www.w3.org/2000/svg'
                      fill='currentColor'
                      viewBox='0 0 18 18'
                    >
                      <path d='M1 18h16a1 1 0 0 0 1-1v-6h-4.439a.99.99 0 0 0-.908.6 3.978 3.978 0 0 1-7.306 0 .99.99 0 0 0-.908-.6H0v6a1 1 0 0 0 1 1Z' />
                      <path d='M4.439 9a2.99 2.99 0 0 1 2.742 1.8 1.977 1.977 0 0 0 3.638 0A2.99 2.99 0 0 1 13.561 9H17.8L15.977.783A1 1 0 0 0 15 0H3a1 1 0 0 0-.977.783L.2 9h4.239Z' />
                    </svg>
                  </div>
                </div>
                <div className='w-full ps-3'>
                  <div className='text-gray-500 text-sm mb-1.5 dark:text-gray-400'>
                    New message from <span className='font-semibold text-gray-900 dark:text-white'>John Doe</span>:
                    {`"Hey, are you free?"`}
                  </div>
                  <div className='text-xs text-orange-600 dark:text-primary'>2 minutes ago</div>
                </div>
              </a>

              {/* You can map multiple items here */}
            </div>

            <a
              href='#'
              className='block py-2 text-sm font-medium text-center text-gray-900 rounded-b-lg bg-gray-50 hover:bg-gray-100 dark:bg-gray-800 dark:hover:bg-gray-700 dark:text-white'
            >
              <div className='inline-flex items-center '>
                <svg
                  className='w-4 h-4 me-2 text-primary dark:text-gray-400'
                  aria-hidden='true'
                  xmlns='http://www.w3.org/2000/svg'
                  fill='currentColor'
                  viewBox='0 0 20 14'
                >
                  <path d='M10 0C4.612 0 0 5.336 0 7c0 1.742 3.546 7 10 7 6.454 0 10-5.258 10-7 0-1.664-4.612-7-10-7Zm0 10a3 3 0 1 1 0-6 3 3 0 0 1 0 6Z' />
                </svg>
                View all
              </div>
            </a>
          </div>
        </motion.div>
      </DropdownContent>
    </Dropdown>
  );
};

export default NotificationsDropdown;
