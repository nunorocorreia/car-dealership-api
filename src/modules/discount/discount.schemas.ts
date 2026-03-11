const discountRuleSchema = {
  type: "object" as const,
  properties: {
    id: { type: "string" as const },
    name: { type: "string" as const },
    amount: { type: "number" as const },
    minYear: { type: "number" as const, nullable: true },
    maxYear: { type: "number" as const, nullable: true },
    make: { type: "string" as const, nullable: true },
    minPrice: { type: "number" as const, nullable: true },
    maxPrice: { type: "number" as const, nullable: true },
    active: { type: "boolean" as const },
    createdAt: { type: "string" as const },
  },
};

const errorSchema = {
  type: "object" as const,
  properties: {
    message: { type: "string" as const },
  },
};

export const getAllRulesSchema = {
  tags: ["Discounts"],
  summary: "List discount rules",
  description: "Retrieve all discount rules",
  response: {
    200: { type: "array" as const, items: discountRuleSchema },
  },
};

export const createRuleSchema = {
  tags: ["Discounts"],
  summary: "Create discount rule",
  description:
    "Create a rule that applies a fixed discount to cars matching the criteria. All non-null criteria must match for the rule to apply.",
  body: {
    type: "object" as const,
    required: ["name", "amount"] as const,
    properties: {
      name: { type: "string" as const, minLength: 1 },
      amount: { type: "number" as const, minimum: 1 },
      minYear: { type: "number" as const },
      maxYear: { type: "number" as const },
      make: { type: "string" as const },
      minPrice: { type: "number" as const, minimum: 0 },
      maxPrice: { type: "number" as const, minimum: 0 },
    },
    additionalProperties: false,
  },
  response: {
    201: discountRuleSchema,
  },
};

export const updateRuleSchema = {
  tags: ["Discounts"],
  summary: "Update discount rule",
  description: "Update a discount rule's fields, including activating or deactivating it",
  params: {
    type: "object" as const,
    required: ["id"] as const,
    properties: {
      id: { type: "string" as const },
    },
  },
  body: {
    type: "object" as const,
    properties: {
      name: { type: "string" as const, minLength: 1 },
      amount: { type: "number" as const, minimum: 1 },
      minYear: { type: "number" as const, nullable: true },
      maxYear: { type: "number" as const, nullable: true },
      make: { type: "string" as const, nullable: true },
      minPrice: { type: "number" as const, nullable: true, minimum: 0 },
      maxPrice: { type: "number" as const, nullable: true, minimum: 0 },
      active: { type: "boolean" as const },
    },
    additionalProperties: false,
  },
  response: {
    200: discountRuleSchema,
    404: errorSchema,
  },
};

export const deleteRuleSchema = {
  tags: ["Discounts"],
  summary: "Delete discount rule",
  description: "Permanently delete a discount rule",
  params: {
    type: "object" as const,
    required: ["id"] as const,
    properties: {
      id: { type: "string" as const },
    },
  },
  response: {
    204: { type: "null" as const },
    404: errorSchema,
  },
};

export const setCarDiscountSchema = {
  tags: ["Cars"],
  summary: "Set car discount",
  description:
    "Set or clear a per-car fixed discount override. Pass amount: null to clear.",
  params: {
    type: "object" as const,
    required: ["id"] as const,
    properties: {
      id: { type: "string" as const },
    },
  },
  body: {
    type: "object" as const,
    required: ["amount"] as const,
    properties: {
      amount: { type: "number" as const, nullable: true, minimum: 0 },
    },
    additionalProperties: false,
  },
  response: {
    200: {
      type: "object" as const,
      properties: {
        message: { type: "string" as const },
      },
    },
    404: errorSchema,
  },
};
