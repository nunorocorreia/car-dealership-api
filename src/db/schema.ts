import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";

export const cars = sqliteTable("cars", {
  id: text("id").primaryKey(),
  make: text("make").notNull(),
  model: text("model").notNull(),
  year: integer("year").notNull(),
  price: integer("price").notNull(),
  mileage: integer("mileage").notNull(),
  color: text("color").notNull(),
  status: text("status", { enum: ["AVAILABLE", "RESERVED", "SOLD"] })
    .notNull()
    .default("AVAILABLE"),
});

export const sales = sqliteTable("sales", {
  id: text("id").primaryKey(),
  carId: text("car_id")
    .notNull()
    .references(() => cars.id),
  leadId: text("lead_id").references(() => leads.id),
  buyerName: text("buyer_name").notNull(),
  buyerEmail: text("buyer_email").notNull(),
  buyerPhone: text("buyer_phone").notNull(),
  salePrice: integer("sale_price").notNull(),
  soldAt: text("sold_at").notNull(),
});

export const leads = sqliteTable("leads", {
  id: text("id").primaryKey(),
  carId: text("car_id")
    .notNull()
    .references(() => cars.id),
  type: text("type", { enum: ["TEST_DRIVE", "INQUIRY", "PURCHASE"] }).notNull(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  phone: text("phone").notNull(),
  preferredDate: text("preferred_date").notNull(),
  message: text("message"),
  status: text("status", { enum: ["NEW", "CONTACTED", "CLOSED"] })
    .notNull()
    .default("NEW"),
  createdAt: text("created_at").notNull(),
});
