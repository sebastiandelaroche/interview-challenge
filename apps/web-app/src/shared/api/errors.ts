import type { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import type { SerializedError } from "@reduxjs/toolkit";

type ApiError = FetchBaseQueryError | SerializedError | undefined;

export function isConflict(error: ApiError): boolean {
  return !!error && "status" in error && error.status === 409;
}

export function getErrorMessage(
  error: ApiError,
  fallback = "Something went wrong",
): string {
  if (!error) return fallback;
  if ("status" in error) {
    const data = error.data as { message?: string | string[] } | undefined;
    const message = data?.message;
    if (Array.isArray(message)) return message.join(", ");
    return message ?? fallback;
  }
  return error.message ?? fallback;
}
