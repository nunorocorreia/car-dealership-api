const leadSchema = {
  type: "object" as const,
  properties: {
    id: { type: "string" as const },
    carId: { type: "string" as const },
    type: { type: "string" as const, enum: ["TEST_DRIVE", "INQUIRY", "PURCHASE"] },
    name: { type: "string" as const },
    email: { type: "string" as const },
    phone: { type: "string" as const },
    preferredDate: { type: "string" as const },
    message: { type: "string" as const },
    status: { type: "string" as const, enum: ["NEW", "CONTACTED", "CLOSED"] },
    createdAt: { type: "string" as const },
  },
};

const errorSchema = {
  type: "object" as const,
  properties: {
    message: { type: "string" as const },
  },
};

export const getAllLeadsSchema = {
  response: {
    200: {
      type: "array" as const,
      items: leadSchema,
    },
  },
};

export const createLeadSchema = {
  body: {
    type: "object" as const,
    required: ["carId", "type", "name", "email", "phone", "preferredDate"] as const,
    properties: {
      carId: { type: "string" as const },
      type: {
        type: "string" as const,
        enum: ["TEST_DRIVE", "INQUIRY", "PURCHASE"],
      },
      name: { type: "string" as const, minLength: 1 },
      email: {
        type: "string" as const,
        pattern: "^[^@\\s]+@[^@\\s]+\\.[^@\\s]+$",
      },
      phone: { type: "string" as const, minLength: 1 },
      preferredDate: {
        type: "string" as const,
        pattern: "^\\d{4}-\\d{2}-\\d{2}$",
      },
      message: { type: "string" as const },
    },
    additionalProperties: false,
  },
  response: {
    201: leadSchema,
    404: errorSchema,
  },
};
