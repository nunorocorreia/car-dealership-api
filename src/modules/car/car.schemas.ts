const carImageSchema = {
  type: "object" as const,
  properties: {
    id: { type: "string" as const },
    carId: { type: "string" as const },
    filename: { type: "string" as const },
    originalName: { type: "string" as const },
    mimeType: { type: "string" as const },
    size: { type: "number" as const },
    isPrimary: { type: "boolean" as const },
    createdAt: { type: "string" as const },
    url: { type: "string" as const },
  },
};

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
    status: {
      type: "string" as const,
      enum: ["AVAILABLE", "RESERVED", "SOLD"],
    },
    images: { type: "array" as const, items: carImageSchema },
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
    status: {
      type: "string" as const,
      enum: ["AVAILABLE", "RESERVED", "SOLD"],
      default: "AVAILABLE",
    },
  },
};

export const getAllSchema = {
  tags: ["Cars"],
  summary: "List cars",
  description: "Browse car inventory with pagination, filtering, and sorting",
  querystring: getAllQuerystring,
  response: {
    200: paginatedCarsSchema,
  },
};

export const getByIdSchema = {
  tags: ["Cars"],
  summary: "Get car by ID",
  description: "Retrieve full details of a single car",
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
