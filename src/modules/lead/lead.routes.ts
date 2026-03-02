import type { FastifyInstance } from "fastify";
import { getAllLeads, getLeadById, createLead } from "./lead.handlers.js";
import { getAllLeadsSchema, getLeadByIdSchema, createLeadSchema } from "./lead.schemas.js";

export async function leadRoutes(app: FastifyInstance) {
  app.get("/leads", { schema: getAllLeadsSchema }, getAllLeads);
  app.get("/leads/:id", { schema: getLeadByIdSchema }, getLeadById);
  app.post("/leads", { schema: createLeadSchema }, createLead);
}
