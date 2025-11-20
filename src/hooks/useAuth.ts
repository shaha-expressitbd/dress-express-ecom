import { selectCurrentToken, selectCurrentUser, selectIsLoggedIn } from "@/lib/features/auth/authSlice";
import { useAppSelector } from "@/lib/hooks";

const useAuth = () => {
  const token = useAppSelector(selectCurrentToken);
  const user = useAppSelector(selectCurrentUser);
  const isLoggedIn = useAppSelector(selectIsLoggedIn);

  return {
    token,
    user,
    isLoggedIn,
  };
};

export default useAuth;
