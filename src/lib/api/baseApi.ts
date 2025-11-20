// api/baseApi.ts
import type {
  BaseQueryFn,
  FetchArgs,
  FetchBaseQueryError,
  FetchBaseQueryMeta,
  QueryReturnValue,
} from "@reduxjs/toolkit/query";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { logout, setUser } from "../features/auth/authSlice";
import { RootState } from "../store";

type ErrorResponse = {
  data?: {
    message?: string;
    errors?: Record<string, string[]>;
  };
  status?: number;
};
const API_URL: string = "/v2/api";
// const API_URL: string = "https://192.168.0.250:5000/v2/api";
// const API_URL: string = "https://developer.calquick.app/v2/api";
// const API_URL: string = "https://backend.calquick.app/v2/api1";

const baseQuery = fetchBaseQuery({
  baseUrl: API_URL,
  prepareHeaders: (headers, { getState }) => {
    const token = (getState() as RootState).auth.token;
    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }
    return headers;
  },
});

const baseQueryWithRefreshToken: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (
  args,
  api,
  extraOptions
): Promise<
  QueryReturnValue<unknown, FetchBaseQueryError, FetchBaseQueryMeta>
> => {
  let result = await baseQuery(args, api, extraOptions);

  if (result.error) {
    const { status, data } = result.error as ErrorResponse;
    const showError = (defaultMessage: string) => {
      const message =
        data?.message ||
        (data?.errors ? Object.values(data.errors).flat().join(" ") : null) ||
        defaultMessage;
      console.error("Error:", message);
    };

    switch (status) {
      case 401: {
        const refreshResult = await baseQuery(
          {
            url: `${API_URL}/auth/refresh-token`,
            method: "POST",
            body: { refreshToken: (api.getState() as RootState).auth.token },
          },
          api,
          extraOptions
        );

        if (refreshResult.data) {
          const response = refreshResult.data as {
            token: string;
            refreshToken?: string;
          };
          api.dispatch(
            setUser({
              token: response.token,
              refreshToken: response.refreshToken,
            })
          );

          result = await baseQuery(args, api, extraOptions);
          //console.log("Initial query result:", result);
        } else {
          showError("Your session has expired. Please log in again.");
          api.dispatch(logout());
        }
        break;
      }

      case 403:
        showError("You don't have permission to perform this action.");
        break;

      case 404:
        showError("The requested resource was not found.");
        break;

      case 500:
        showError("Server error. Please try again later.");
        break;

      case 400:
        showError("Invalid request. Please check your input.");
        break;

      default:
        showError("An unexpected error occurred.");
        break;
    }
  }

  return result;
};

export const baseApi = createApi({
  reducerPath: "baseApi",
  baseQuery: baseQueryWithRefreshToken,
  tagTypes: [],
  endpoints: () => ({}),
});
