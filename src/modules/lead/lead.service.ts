import { randomUUID } from "node:crypto";
import { eq } from "drizzle-orm";
import type { CreateLeadInput } from "../../models/lead.js";
import { getDb } from "../../db/index.js";
import { leads } from "../../db/schema.js";
import * as carService from "../car/car.service.js";

type Lead = typeof leads.$inferSelect;

export async function getAll(): Promise<Lead[]> {
  const db = getDb();
  return db.select().from(leads).all();
}

export async function create(input: CreateLeadInput): Promise<Lead> {
  const car = await carService.getById(input.carId);
  if (!car) {
    throw new CarNotFoundError(input.carId);
  }

  const db = getDb();
  const lead = {
    id: randomUUID(),
    ...input,
    status: "NEW" as const,
    createdAt: new Date().toISOString(),
  };

  db.insert(leads).values(lead).run();

  return db.select().from(leads).where(eq(leads.id, lead.id)).get()!;
}

export class CarNotFoundError extends Error {
  constructor(carId: string) {
    super(`Car with id "${carId}" not found`);
    this.name = "CarNotFoundError";
  }
}
