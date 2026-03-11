import { eq, like, gte, lte, and, asc, desc, count, type SQL } from "drizzle-orm";
import type { CarQuery, PaginatedResult } from "../../models/car.js";
import { getDb } from "../../db/index.js";
import { cars, carImages } from "../../db/schema.js";
import type { CarImageResponse } from "../../models/car-image.js";
import { computeDiscount } from "../discount/discount.service.js";

type Car = typeof cars.$inferSelect;
type CarWithImages = Car & { images: CarImageResponse[] };
type CarWithDiscount = CarWithImages & { discountAmount: number; discountedPrice: number };

function toImageResponse(img: typeof carImages.$inferSelect): CarImageResponse {
  return {
    ...img,
    isPrimary: !!img.isPrimary,
    url: `/uploads/cars/${img.filename}`,
  };
}

function attachImages(db: ReturnType<typeof getDb>, carList: Car[]): CarWithImages[] {
  if (carList.length === 0) return [];

  const carIds = carList.map((c) => c.id);
  const allImages = db
    .select()
    .from(carImages)
    .all()
    .filter((img) => carIds.includes(img.carId));

  const imagesByCarId = new Map<string, CarImageResponse[]>();
  for (const img of allImages) {
    const list = imagesByCarId.get(img.carId) ?? [];
    list.push(toImageResponse(img));
    imagesByCarId.set(img.carId, list);
  }

  return carList.map((car) => ({
    ...car,
    images: imagesByCarId.get(car.id) ?? [],
  }));
}

export async function getAll(query: CarQuery): Promise<PaginatedResult<CarWithImages>> {
  const db = getDb();
  const filters = buildFilters(query);

  const [{ total }] = db
    .select({ total: count() })
    .from(cars)
    .where(filters)
    .all();

  const page = query.page ?? 1;
  const limit = query.limit ?? 10;
  const totalPages = Math.ceil(total / limit);
  const offset = (page - 1) * limit;

  const orderBy = buildOrderBy(query);

  const data = db
    .select()
    .from(cars)
    .where(filters)
    .orderBy(orderBy)
    .limit(limit)
    .offset(offset)
    .all();

  const carsWithImages = attachImages(db, data);
  return { data: applyDiscounts(carsWithImages), total, page, limit, totalPages };
}

export async function getById(id: string): Promise<CarWithDiscount | undefined> {
  const db = getDb();
  const car = db.select().from(cars).where(eq(cars.id, id)).get();
  if (!car) return undefined;
  return applyDiscounts(attachImages(db, [car]))[0];
}

function applyDiscounts(carList: CarWithImages[]): CarWithDiscount[] {
  return carList.map((car) => ({ ...car, ...computeDiscount(car) }));
}

function buildFilters(query: CarQuery): SQL | undefined {
  const conditions: SQL[] = [];

  if (query.make) {
    conditions.push(like(cars.make, query.make));
  }
  if (query.model) {
    conditions.push(like(cars.model, query.model));
  }
  if (query.minPrice != null) {
    conditions.push(gte(cars.price, query.minPrice));
  }
  if (query.maxPrice != null) {
    conditions.push(lte(cars.price, query.maxPrice));
  }
  if (query.minYear != null) {
    conditions.push(gte(cars.year, query.minYear));
  }
  if (query.maxYear != null) {
    conditions.push(lte(cars.year, query.maxYear));
  }
  if (query.status) {
    conditions.push(eq(cars.status, query.status));
  }

  if (conditions.length === 0) return undefined;

  return and(...conditions);
}

function buildOrderBy(query: CarQuery) {
  if (!query.sortBy) return asc(cars.id);

  const column = cars[query.sortBy];
  return query.order === "desc" ? desc(column) : asc(column);
}
