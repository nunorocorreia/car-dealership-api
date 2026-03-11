import type { FastifyInstance } from "fastify";
import { getStats } from "./stats.service.js";
import { getStatsSchema } from "./stats.schemas.js";

export async function statsRoutes(app: FastifyInstance) {
  app.get("/stats", { schema: getStatsSchema }, async () => {
    return getStats();
  });
}
