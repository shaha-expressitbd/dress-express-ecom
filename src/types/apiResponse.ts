import { MetaResponse } from "./metaResponse";

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  meta: MetaResponse;
}
