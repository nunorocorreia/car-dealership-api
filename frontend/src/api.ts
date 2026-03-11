import type { Car, CarQuery, PaginatedResult } from "./types";

const BASE = "/api";

export async function fetchCars(
  query: CarQuery = {}
): Promise<PaginatedResult<Car>> {
  const params = new URLSearchParams();

  for (const [key, value] of Object.entries(query)) {
    if (value !== undefined && value !== "") {
      params.set(key, String(value));
    }
  }

  const res = await fetch(`${BASE}/cars?${params}`);
  if (!res.ok) throw new Error(`Failed to fetch cars: ${res.statusText}`);
  return res.json();
}
