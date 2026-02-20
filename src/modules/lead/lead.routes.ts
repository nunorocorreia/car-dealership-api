import type { FastifyInstance } from "fastify";
import { getAllLeads, createLead } from "./lead.handlers.js";
import { getAllLeadsSchema, createLeadSchema } from "./lead.schemas.js";

export async function leadRoutes(app: FastifyInstance) {
  app.get("/leads", { schema: getAllLeadsSchema }, getAllLeads);
  app.post("/leads", { schema: createLeadSchema }, createLead);
}
