"use client";
import { useGetBusinessQuery } from "@/lib/api/publicApi";
import { RootState } from "@/lib/store";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setBusiness, setError, setLoading } from "../features/business/businessSlice";

export default function BusinessProvider({ children }: { children: React.ReactNode }) {
  const dispatch = useDispatch();
  const { data, isLoading, error, isFetching } = useGetBusinessQuery();
  const businessData = useSelector((state: RootState) => state.business.data);

  useEffect(() => {
    if (isLoading) {
      dispatch(setLoading());
    } else if (error) {
      dispatch(setError(error instanceof Error ? error.message : "Failed to load business data"));
    } else if (data) {
      dispatch(setBusiness(data));
    }
  }, [data, isLoading, error, dispatch]);

  // Return null during initial load to prevent undefined access
  if (!businessData && (isLoading || isFetching)) {
    return null;
  }

  return <>{children}</>;
}
