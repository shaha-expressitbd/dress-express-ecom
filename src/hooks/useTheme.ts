import { RootState } from "@/lib/store";
import { useDispatch, useSelector } from "react-redux";
import { setThemeColor, toggleThemeMode } from "../lib/features/theme/themeSlice";

const useTheme = () => {
  const dispatch = useDispatch();
  const { mode, color } = useSelector((state: RootState) => state.theme);

  const toggleMode = () => {
    dispatch(toggleThemeMode());
  };

  const changeColor = (newColor: RootState["theme"]["color"]) => {
    dispatch(setThemeColor(newColor));
  };

  return { mode, color, toggleMode, changeColor };
};

export default useTheme;
