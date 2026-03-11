const statusCountSchema = {
  type: "object" as const,
  properties: {
    NEW: { type: "number" as const },
    CONTACTED: { type: "number" as const },
    CLOSED: { type: "number" as const },
  },
};

const typeCountSchema = {
  type: "object" as const,
  properties: {
    TEST_DRIVE: { type: "number" as const },
    INQUIRY: { type: "number" as const },
    PURCHASE: { type: "number" as const },
  },
};

const statsResponseSchema = {
  type: "object" as const,
  properties: {
    inventory: {
      type: "object" as const,
      properties: {
        total: { type: "number" as const },
        available: { type: "number" as const },
        reserved: { type: "number" as const },
        sold: { type: "number" as const },
      },
    },
    sales: {
      type: "object" as const,
      properties: {
        total: { type: "number" as const },
        revenue: { type: "number" as const },
      },
    },
    leads: {
      type: "object" as const,
      properties: {
        total: { type: "number" as const },
        byStatus: statusCountSchema,
        byType: typeCountSchema,
      },
    },
  },
};

export const getStatsSchema = {
  tags: ["Dashboard"],
  summary: "Dashboard stats",
  description:
    "Aggregated metrics: inventory breakdown, total sales and revenue, leads by status and type",
  response: {
    200: statsResponseSchema,
  },
};
