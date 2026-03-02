import { randomUUID } from "node:crypto";
import { eq } from "drizzle-orm";
import type { CreateSaleInput } from "../../models/sale.js";
import { getDb } from "../../db/index.js";
import { sales, cars, leads } from "../../db/schema.js";

type Sale = typeof sales.$inferSelect;
type Car = typeof cars.$inferSelect;

export interface SaleWithCar extends Sale {
  car: Car;
}

export async function getAll(): Promise<SaleWithCar[]> {
  const db = getDb();
  const rows = db.select().from(sales).all();

  return rows.map((sale) => {
    const car = db.select().from(cars).where(eq(cars.id, sale.carId)).get()!;
    return { ...sale, car };
  });
}

export async function getById(id: string): Promise<SaleWithCar | undefined> {
  const db = getDb();
  const sale = db.select().from(sales).where(eq(sales.id, id)).get();
  if (!sale) return undefined;

  const car = db.select().from(cars).where(eq(cars.id, sale.carId)).get()!;
  return { ...sale, car };
}

export async function create(input: CreateSaleInput): Promise<SaleWithCar> {
  const db = getDb();

  const car = db.select().from(cars).where(eq(cars.id, input.carId)).get();
  if (!car) {
    throw new CarNotFoundError(input.carId);
  }
  if (car.status !== "AVAILABLE") {
    throw new CarNotAvailableError(input.carId, car.status);
  }

  if (input.leadId) {
    const lead = db
      .select()
      .from(leads)
      .where(eq(leads.id, input.leadId))
      .get();
    if (!lead) {
      throw new LeadNotFoundError(input.leadId);
    }
  }

  const sale = {
    id: randomUUID(),
    carId: input.carId,
    leadId: input.leadId ?? null,
    buyerName: input.buyerName,
    buyerEmail: input.buyerEmail,
    buyerPhone: input.buyerPhone,
    salePrice: input.salePrice,
    soldAt: new Date().toISOString(),
  };

  db.transaction((tx) => {
    tx.insert(sales).values(sale).run();
    tx.update(cars)
      .set({ status: "SOLD" })
      .where(eq(cars.id, input.carId))
      .run();
  });

  const updatedCar = db
    .select()
    .from(cars)
    .where(eq(cars.id, input.carId))
    .get()!;

  return { ...sale, car: updatedCar };
}

export class CarNotFoundError extends Error {
  constructor(carId: string) {
    super(`Car with id "${carId}" not found`);
    this.name = "CarNotFoundError";
  }
}

export class CarNotAvailableError extends Error {
  constructor(carId: string, currentStatus: string) {
    super(`Car with id "${carId}" is not available (status: ${currentStatus})`);
    this.name = "CarNotAvailableError";
  }
}

export class LeadNotFoundError extends Error {
  constructor(leadId: string) {
    super(`Lead with id "${leadId}" not found`);
    this.name = "LeadNotFoundError";
  }
}
