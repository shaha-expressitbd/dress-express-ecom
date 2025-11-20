import { baseApi } from "../../api/baseApi";

const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    register: builder.mutation({
      query: (formData) => ({
        url: "/user/register",
        method: "POST",
        body: formData,
      }),
    }),
    verifyNewUser: builder.mutation({
      query: (formData) => ({
        url: "/user/verify-otp",
        method: "POST",
        body: formData,
      }),
    }),
    login: builder.mutation({
      query: (formData) => ({
        url: "/auth/login",
        method: "POST",
        body: formData,
      }),
    }),
    changePassword: builder.mutation({
      query: (formData) => ({
        url: "/auth/change-password",
        method: "POST",
        body: formData,
      }),
    }),
    refreshToken: builder.mutation({
      query: (formData) => ({
        url: "/auth/refresh-token",
        method: "POST",
        body: { formData },
      }),
    }),
    forgotPassword: builder.mutation({
      query: (credential) => ({
        url: "/auth/forgot-password",
        method: "POST",
        body: { credential },
      }),
    }),
    verifyForgotPasswordOtp: builder.mutation({
      query: (formData) => ({
        url: "/auth/verify-otp",
        method: "POST",
        body: formData,
      }),
    }),
    resetPassword: builder.mutation({
      query: (formData) => ({
        url: "/auth/reset-password",
        method: "POST",
        body: formData,
      }),
    }),
  }),
});

export const {
  useRegisterMutation,
  useVerifyNewUserMutation,
  useLoginMutation,
  useChangePasswordMutation,
  useRefreshTokenMutation,
  useForgotPasswordMutation,
  useVerifyForgotPasswordOtpMutation,
  useResetPasswordMutation,
} = authApi;
