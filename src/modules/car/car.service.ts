import type { Car, CarQuery, PaginatedResult } from "../../models/car.js";
import carsData from "../../data/cars.json" with { type: "json" };

const cars: Car[] = carsData;

export async function getAll(query: CarQuery): Promise<PaginatedResult<Car>> {
  let result = cars;

  result = applyFilters(result, query);
  result = applySort(result, query);

  return paginate(result, query);
}

export async function getById(id: string): Promise<Car | undefined> {
  return cars.find((car) => car.id === id);
}

function applyFilters(cars: Car[], query: CarQuery): Car[] {
  return cars.filter((car) => {
    if (query.make && car.make.toLowerCase() !== query.make.toLowerCase())
      return false;
    if (query.model && car.model.toLowerCase() !== query.model.toLowerCase())
      return false;
    if (query.minPrice != null && car.price < query.minPrice) return false;
    if (query.maxPrice != null && car.price > query.maxPrice) return false;
    if (query.minYear != null && car.year < query.minYear) return false;
    if (query.maxYear != null && car.year > query.maxYear) return false;
    return true;
  });
}

function applySort(cars: Car[], query: CarQuery): Car[] {
  if (!query.sortBy) return cars;

  const direction = query.order === "desc" ? -1 : 1;

  return [...cars].sort((a, b) => (a[query.sortBy!] - b[query.sortBy!]) * direction);
}

function paginate(cars: Car[], query: CarQuery): PaginatedResult<Car> {
  const page = query.page ?? 1;
  const limit = query.limit ?? 10;
  const total = cars.length;
  const totalPages = Math.ceil(total / limit);
  const start = (page - 1) * limit;
  const data = cars.slice(start, start + limit);

  return { data, total, page, limit, totalPages };
}
