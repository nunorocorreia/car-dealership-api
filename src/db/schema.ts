import { sqliteTable, text, integer, index } from "drizzle-orm/sqlite-core";

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
  discountAmount: integer("discount_amount"),
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

export const carImages = sqliteTable(
  "car_images",
  {
    id: text("id").primaryKey(),
    carId: text("car_id")
      .notNull()
      .references(() => cars.id, { onDelete: "cascade" }),
    filename: text("filename").notNull(),
    originalName: text("original_name").notNull(),
    mimeType: text("mime_type").notNull(),
    size: integer("size").notNull(),
    isPrimary: integer("is_primary", { mode: "boolean" })
      .notNull()
      .default(false),
    createdAt: text("created_at").notNull(),
  },
  (table) => [index("car_images_car_id_idx").on(table.carId)],
);

export const discountRules = sqliteTable("discount_rules", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  amount: integer("amount").notNull(),
  minYear: integer("min_year"),
  maxYear: integer("max_year"),
  make: text("make"),
  minPrice: integer("min_price"),
  maxPrice: integer("max_price"),
  active: integer("active", { mode: "boolean" }).notNull().default(true),
  createdAt: text("created_at").notNull(),
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
