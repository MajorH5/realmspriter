"use client";

export type APIResponse<T> = {
    message: string;
    data: T | null;
    success: boolean;
};

const API_URL = process.env.NEXT_PUBLIC_API_URL!;

function getApiUrl(endpoint: string): string {
    return `${API_URL}/api/v1/${endpoint}`;
};

export async function api<T>(endpoint: string, options: RequestInit): Promise<APIResponse<T>> {
    if (process.env.NEXT_PUBLIC_NEXT_ENV === "development") {
        options.credentials = "include";
    }

    const promise = fetch(getApiUrl(endpoint), options);
    return promise
        .then((response) => response.json())
        .catch((error) => (console.log(error), { message: error.toString(), data: null, success: false }));
};

type Params = Record<string, string | number | boolean>;
export function encodeParams (params: Params): string {
  return Object.entries(params)
    .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`)
    .join("&");
};
