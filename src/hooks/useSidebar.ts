import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useMediaQuery } from "react-responsive";
import { closeSidebar, openSidebar } from "../lib/features/sidebar/sidebarSlice";
import { RootState } from "../lib/store";

export const useSidebar = () => {
  const dispatch = useDispatch();
  const isSidebarOpen = useSelector((state: RootState) => state.sidebar.isOpen);
  const isDesktop = useMediaQuery({ minWidth: 1536 });
  const [isManualToggle, setIsManualToggle] = useState(false);

  useEffect(() => {
    if (!isManualToggle) {
      if (isDesktop) {
        dispatch(openSidebar());
      } else {
        dispatch(closeSidebar());
      }
    }
  }, [isDesktop, dispatch, isManualToggle]);

  useEffect(() => {
    setIsManualToggle(false);
  }, [isDesktop]);

  const open = () => {
    setIsManualToggle(true);
    dispatch(openSidebar());
  };

  const close = () => {
    setIsManualToggle(true);
    dispatch(closeSidebar());
  };

  const toggle = () => {
    setIsManualToggle(true);
    if (isSidebarOpen) {
      close();
    } else {
      open();
    }
  };

  return {
    isSidebarOpen,
    isDesktop,
    open,
    close,
    toggle,
  };
};
