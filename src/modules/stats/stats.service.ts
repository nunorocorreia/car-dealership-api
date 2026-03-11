import { count, sum, eq } from "drizzle-orm";
import { getDb } from "../../db/index.js";
import { cars, sales, leads } from "../../db/schema.js";

export async function getStats() {
  const db = getDb();

  const inventoryRows = db
    .select({ status: cars.status, count: count() })
    .from(cars)
    .groupBy(cars.status)
    .all();

  const inventory = {
    total: 0,
    available: 0,
    reserved: 0,
    sold: 0,
  };
  for (const row of inventoryRows) {
    inventory.total += row.count;
    if (row.status === "AVAILABLE") inventory.available = row.count;
    if (row.status === "RESERVED") inventory.reserved = row.count;
    if (row.status === "SOLD") inventory.sold = row.count;
  }

  const [salesAgg] = db
    .select({ total: count(), revenue: sum(sales.salePrice) })
    .from(sales)
    .all();

  const leadsByStatus = db
    .select({ status: leads.status, count: count() })
    .from(leads)
    .groupBy(leads.status)
    .all();

  const leadsByType = db
    .select({ type: leads.type, count: count() })
    .from(leads)
    .groupBy(leads.type)
    .all();

  const leadsTotal = leadsByStatus.reduce((acc, r) => acc + r.count, 0);

  return {
    inventory,
    sales: {
      total: salesAgg.total,
      revenue: Number(salesAgg.revenue ?? 0),
    },
    leads: {
      total: leadsTotal,
      byStatus: Object.fromEntries(leadsByStatus.map((r) => [r.status, r.count])),
      byType: Object.fromEntries(leadsByType.map((r) => [r.type, r.count])),
    },
  };
}
