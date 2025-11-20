import { SerializedError } from "@reduxjs/toolkit";
import { FetchBaseQueryError } from "@reduxjs/toolkit/query";

export interface ApiErrorResponse {
  message: string;
  statusCode?: number;
  data?: unknown;
}

export class TError<T = unknown> extends Error {
  status: number;
  data?: T;

  constructor(status: number = 500, message: string = "An unexpected error occurred", data?: T) {
    super(message);
    this.status = status;
    this.data = data;

    // Fix prototype chain for instanceof to work correctly
    Object.setPrototypeOf(this, new.target.prototype);
  }

  toJSON() {
    return {
      status: this.status,
      message: this.message,
      ...(this.data ? { data: this.data } : {}),
    };
  }
}

export type ApiError = FetchBaseQueryError & {
  data?: ApiErrorResponse;
};

export type AppError = ApiError | SerializedError;

export default TError;
