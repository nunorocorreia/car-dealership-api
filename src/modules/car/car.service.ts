import { eq, like, gte, lte, and, asc, desc, count, type SQL } from "drizzle-orm";
import type { CarQuery, PaginatedResult } from "../../models/car.js";
import { getDb } from "../../db/index.js";
import { cars } from "../../db/schema.js";

type Car = typeof cars.$inferSelect;

export async function getAll(query: CarQuery): Promise<PaginatedResult<Car>> {
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

  return { data, total, page, limit, totalPages };
}

export async function getById(id: string): Promise<Car | undefined> {
  const db = getDb();
  return db.select().from(cars).where(eq(cars.id, id)).get();
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

  if (conditions.length === 0) return undefined;

  return and(...conditions);
}

function buildOrderBy(query: CarQuery) {
  if (!query.sortBy) return asc(cars.id);

  const column = cars[query.sortBy];
  return query.order === "desc" ? desc(column) : asc(column);
}
