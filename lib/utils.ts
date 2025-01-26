import { clsx, type ClassValue } from "clsx";
import useSWR from "swr";
import { twMerge } from "tailwind-merge";

export const API_URL =
  process.env.NODE_ENV === "development" || !process.env.NODE_ENV
    ? "http://127.0.0.1:8000"
    : "";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const fetcher = (...args: Parameters<typeof fetch>) =>
  fetch(...args).then((res) => res.json());

export function useConfiguredSWR<T>(route: string) {
  let route_fmt = API_URL + route;
  return useSWR<T, Error>(route_fmt, fetcher, {
    refreshInterval: 5000,
    fallbackData: {
      error: "Failed to fetch via useSWR",
    } as T,
  });
}
