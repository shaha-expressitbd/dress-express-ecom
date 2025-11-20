import { useGetBusinessQuery } from "@/lib/api/publicApi";
import {
  setBusiness,
  setError,
  setLoading,
} from "@/lib/features/business/businessSlice";
import { useAppDispatch } from "@/lib/hooks";
import { Business } from "@/types/business";
import { useEffect, useMemo } from "react";

export const useBusiness = () => {
  const dispatch = useAppDispatch();
  const {
    data: businessData,
    isLoading,
    error,
    isFetching,
  } = useGetBusinessQuery();

  const memoizedActions = useMemo(
    () => ({
      setLoading: () => dispatch(setLoading()),
      setError: (msg: string) => dispatch(setError(msg)),
      setBusiness: (data: Business) => dispatch(setBusiness(data)),
    }),
    [dispatch]
  );

  useEffect(() => {
    if (isLoading) {
      memoizedActions.setLoading();
    } else if (error) {
      memoizedActions.setError(
        error instanceof Error ? error.message : "Failed to load business data"
      );
    } else if (businessData) {
      memoizedActions.setBusiness(businessData);
    }
  }, [businessData, isLoading, error, memoizedActions]);

  return useMemo(
    () => ({
      businessData,
      isLoading,
      error,
      isFetching,
    }),
    [businessData, isLoading, error, isFetching]
  );
};
