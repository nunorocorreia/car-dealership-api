export const carSchema = {
  type: "object" as const,
  properties: {
    id: { type: "string" as const },
    make: { type: "string" as const },
    model: { type: "string" as const },
    year: { type: "number" as const },
    price: { type: "number" as const },
    mileage: { type: "number" as const },
    color: { type: "string" as const },
  },
};

const paginatedCarsSchema = {
  type: "object" as const,
  properties: {
    data: { type: "array" as const, items: carSchema },
    total: { type: "number" as const },
    page: { type: "number" as const },
    limit: { type: "number" as const },
    totalPages: { type: "number" as const },
  },
};

const getAllQuerystring = {
  type: "object" as const,
  properties: {
    page: { type: "number" as const, minimum: 1, default: 1 },
    limit: { type: "number" as const, minimum: 1, maximum: 100, default: 10 },
    make: { type: "string" as const },
    model: { type: "string" as const },
    minPrice: { type: "number" as const, minimum: 0 },
    maxPrice: { type: "number" as const, minimum: 0 },
    minYear: { type: "number" as const },
    maxYear: { type: "number" as const },
    sortBy: { type: "string" as const, enum: ["price", "year", "mileage"] },
    order: { type: "string" as const, enum: ["asc", "desc"], default: "asc" },
  },
};

export const getAllSchema = {
  querystring: getAllQuerystring,
  response: {
    200: paginatedCarsSchema,
  },
};

export const getByIdSchema = {
  params: {
    type: "object" as const,
    required: ["id"] as const,
    properties: {
      id: { type: "string" as const },
    },
  },
  response: {
    200: carSchema,
    404: {
      type: "object" as const,
      properties: {
        message: { type: "string" as const },
      },
    },
  },
};
