"use client";

import { useAuth } from "@clerk/nextjs";

const API_URL = "http://localhost:5000";

export function useApi() {
  const { getToken } = useAuth();

  const request = async (
    endpoint: string,
    options: RequestInit = {}
  ) => {
    const token = await getToken();

    if (!token) {
      throw new Error("User is not authenticated");
    }

    const response = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...(options.headers || {}),
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "API request failed");
    }

    return data;
  };

  return { request };
}