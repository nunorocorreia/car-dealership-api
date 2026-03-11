import { useState, useEffect, useCallback } from "react";
import type { Car, CarQuery, PaginatedResult } from "../types";
import { fetchCars } from "../api";

const INITIAL_STATE: PaginatedResult<Car> = {
  data: [],
  total: 0,
  page: 1,
  limit: 12,
  totalPages: 0,
};

export function useCars(query: CarQuery) {
  const [result, setResult] = useState<PaginatedResult<Car>>(INITIAL_STATE);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchCars(query);
      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }, [JSON.stringify(query)]);

  useEffect(() => {
    load();
  }, [load]);

  return { ...result, loading, error, reload: load };
}
