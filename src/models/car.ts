export const CAR_STATUSES = ["AVAILABLE", "RESERVED", "SOLD"] as const;
export type CarStatus = (typeof CAR_STATUSES)[number];

export interface Car {
  id: string;
  make: string;
  model: string;
  year: number;
  price: number;
  mileage: number;
  color: string;
  status: CarStatus;
}

export interface CarQuery {
  page?: number;
  limit?: number;
  make?: string;
  model?: string;
  minPrice?: number;
  maxPrice?: number;
  minYear?: number;
  maxYear?: number;
  sortBy?: "price" | "year" | "mileage";
  order?: "asc" | "desc";
  status?: CarStatus;
}

export interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
