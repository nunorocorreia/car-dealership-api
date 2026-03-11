import type { FastifyInstance } from "fastify";
import {
  getAllRules,
  createRule,
  updateRule,
  deleteRule,
  setCarDiscount,
} from "./discount.handlers.js";
import {
  getAllRulesSchema,
  createRuleSchema,
  updateRuleSchema,
  deleteRuleSchema,
  setCarDiscountSchema,
} from "./discount.schemas.js";

export async function discountRoutes(app: FastifyInstance) {
  app.get("/discounts", { schema: getAllRulesSchema }, getAllRules);
  app.post("/discounts", { schema: createRuleSchema }, createRule);
  app.patch("/discounts/:id", { schema: updateRuleSchema }, updateRule);
  app.delete("/discounts/:id", { schema: deleteRuleSchema }, deleteRule);
  app.patch("/cars/:id/discount", { schema: setCarDiscountSchema }, setCarDiscount);
}
