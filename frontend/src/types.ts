export type CarStatus = "AVAILABLE" | "RESERVED" | "SOLD";

export interface CarImage {
  id: string;
  url: string;
  isPrimary: boolean;
}

export interface Car {
  id: string;
  make: string;
  model: string;
  year: number;
  price: number;
  mileage: number;
  color: string;
  status: CarStatus;
  images: CarImage[];
  discountAmount: number;
  discountedPrice: number;
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
