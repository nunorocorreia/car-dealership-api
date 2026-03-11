import { randomUUID } from "node:crypto";
import { eq } from "drizzle-orm";
import { getDb } from "../../db/index.js";
import { discountRules, cars } from "../../db/schema.js";

type DiscountRule = typeof discountRules.$inferSelect;
type Car = typeof cars.$inferSelect;

export interface CreateRuleInput {
  name: string;
  amount: number;
  minYear?: number;
  maxYear?: number;
  make?: string;
  minPrice?: number;
  maxPrice?: number;
}

export interface UpdateRuleInput {
  name?: string;
  amount?: number;
  minYear?: number | null;
  maxYear?: number | null;
  make?: string | null;
  minPrice?: number | null;
  maxPrice?: number | null;
  active?: boolean;
}

export async function getAllRules(): Promise<DiscountRule[]> {
  const db = getDb();
  return db.select().from(discountRules).all();
}

export async function createRule(input: CreateRuleInput): Promise<DiscountRule> {
  const db = getDb();
  const rule = {
    id: randomUUID(),
    name: input.name,
    amount: input.amount,
    minYear: input.minYear ?? null,
    maxYear: input.maxYear ?? null,
    make: input.make ?? null,
    minPrice: input.minPrice ?? null,
    maxPrice: input.maxPrice ?? null,
    active: true,
    createdAt: new Date().toISOString(),
  };

  db.insert(discountRules).values(rule).run();
  return rule;
}

export async function updateRule(
  id: string,
  input: UpdateRuleInput,
): Promise<DiscountRule> {
  const db = getDb();
  const existing = db.select().from(discountRules).where(eq(discountRules.id, id)).get();
  if (!existing) throw new RuleNotFoundError(id);

  const updates: Record<string, unknown> = {};
  if (input.name !== undefined) updates.name = input.name;
  if (input.amount !== undefined) updates.amount = input.amount;
  if (input.minYear !== undefined) updates.minYear = input.minYear;
  if (input.maxYear !== undefined) updates.maxYear = input.maxYear;
  if (input.make !== undefined) updates.make = input.make;
  if (input.minPrice !== undefined) updates.minPrice = input.minPrice;
  if (input.maxPrice !== undefined) updates.maxPrice = input.maxPrice;
  if (input.active !== undefined) updates.active = input.active;

  db.update(discountRules).set(updates).where(eq(discountRules.id, id)).run();

  return db.select().from(discountRules).where(eq(discountRules.id, id)).get()!;
}

export async function deleteRule(id: string): Promise<void> {
  const db = getDb();
  const existing = db.select().from(discountRules).where(eq(discountRules.id, id)).get();
  if (!existing) throw new RuleNotFoundError(id);

  db.delete(discountRules).where(eq(discountRules.id, id)).run();
}

export async function setCarDiscount(
  carId: string,
  amount: number | null,
): Promise<Car> {
  const db = getDb();
  const car = db.select().from(cars).where(eq(cars.id, carId)).get();
  if (!car) throw new CarNotFoundError(carId);

  db.update(cars)
    .set({ discountAmount: amount })
    .where(eq(cars.id, carId))
    .run();

  return db.select().from(cars).where(eq(cars.id, carId)).get()!;
}

function ruleMatches(rule: DiscountRule, car: Car): boolean {
  if (rule.make && rule.make !== car.make) return false;
  if (rule.minYear != null && car.year < rule.minYear) return false;
  if (rule.maxYear != null && car.year > rule.maxYear) return false;
  if (rule.minPrice != null && car.price < rule.minPrice) return false;
  if (rule.maxPrice != null && car.price > rule.maxPrice) return false;
  return true;
}

export function computeDiscount(car: Car): { discountAmount: number; discountedPrice: number } {
  if (car.discountAmount) {
    const disc = Math.min(car.discountAmount, car.price);
    return { discountAmount: disc, discountedPrice: car.price - disc };
  }

  const db = getDb();
  const activeRules = db
    .select()
    .from(discountRules)
    .where(eq(discountRules.active, true))
    .all();

  const matching = activeRules.filter((r) => ruleMatches(r, car));
  if (matching.length === 0) {
    return { discountAmount: 0, discountedPrice: car.price };
  }

  const best = matching.sort((a, b) => b.amount - a.amount)[0];
  const disc = Math.min(best.amount, car.price);
  return { discountAmount: disc, discountedPrice: car.price - disc };
}

export class RuleNotFoundError extends Error {
  constructor(id: string) {
    super(`Discount rule with id "${id}" not found`);
    this.name = "RuleNotFoundError";
  }
}

export class CarNotFoundError extends Error {
  constructor(carId: string) {
    super(`Car with id "${carId}" not found`);
    this.name = "CarNotFoundError";
  }
}
