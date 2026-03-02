import type { FastifyInstance } from "fastify";
import { getAllSales, getSaleById, createSale } from "./sale.handlers.js";
import {
  getAllSalesSchema,
  getSaleByIdSchema,
  createSaleSchema,
} from "./sale.schemas.js";

export async function saleRoutes(app: FastifyInstance) {
  app.get("/sales", { schema: getAllSalesSchema }, getAllSales);
  app.get("/sales/:id", { schema: getSaleByIdSchema }, getSaleById);
  app.post("/sales", { schema: createSaleSchema }, createSale);
}
