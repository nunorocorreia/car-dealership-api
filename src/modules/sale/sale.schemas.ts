import { carSchema } from "../car/car.schemas.js";

const saleSchema = {
  type: "object" as const,
  properties: {
    id: { type: "string" as const },
    carId: { type: "string" as const },
    leadId: { type: "string" as const, nullable: true },
    buyerName: { type: "string" as const },
    buyerEmail: { type: "string" as const },
    buyerPhone: { type: "string" as const },
    salePrice: { type: "number" as const },
    soldAt: { type: "string" as const },
  },
};

const saleWithCarSchema = {
  type: "object" as const,
  properties: {
    ...saleSchema.properties,
    car: carSchema,
  },
};

const errorSchema = {
  type: "object" as const,
  properties: {
    message: { type: "string" as const },
  },
};

export const getAllSalesSchema = {
  tags: ["Sales"],
  summary: "List sales",
  description: "Retrieve all sale transactions",
  response: {
    200: {
      type: "array" as const,
      items: saleWithCarSchema,
    },
  },
};

export const getSaleByIdSchema = {
  tags: ["Sales"],
  summary: "Get sale by ID",
  description: "Retrieve a single sale transaction by its ID",
  params: {
    type: "object" as const,
    required: ["id"] as const,
    properties: {
      id: { type: "string" as const },
    },
  },
  response: {
    200: saleWithCarSchema,
    404: errorSchema,
  },
};

export const createSaleSchema = {
  tags: ["Sales"],
  summary: "Record a sale",
  description:
    "Record a car sale. Marks the car as SOLD and creates a transaction record.",
  body: {
    type: "object" as const,
    required: [
      "carId",
      "buyerName",
      "buyerEmail",
      "buyerPhone",
      "salePrice",
    ] as const,
    properties: {
      carId: { type: "string" as const },
      leadId: { type: "string" as const },
      buyerName: { type: "string" as const, minLength: 1 },
      buyerEmail: {
        type: "string" as const,
        pattern: "^[^@\\s]+@[^@\\s]+\\.[^@\\s]+$",
      },
      buyerPhone: { type: "string" as const, minLength: 1 },
      salePrice: { type: "number" as const, minimum: 0 },
    },
    additionalProperties: false,
  },
  response: {
    201: saleWithCarSchema,
    404: errorSchema,
    409: errorSchema,
  },
};
