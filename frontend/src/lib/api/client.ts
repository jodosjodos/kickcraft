import axios, { type AxiosError } from "axios";
import type { ApiError } from "@/types/api/common";

const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError<{ message?: string; statusCode?: number; code?: string }>) => {
    const status = error.response?.status ?? 500;
    const data = error.response?.data;

    const normalized: ApiError = {
      message: data?.message ?? "An unexpected error occurred",
      code: data?.code,
      statusCode: data?.statusCode ?? status,
    };

    return Promise.reject(normalized);
  }
);

export default apiClient;
