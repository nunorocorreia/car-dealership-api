import type { FastifyInstance } from "fastify";
import { getAllCars, getCarById } from "./car.handlers.js";
import { getAllSchema, getByIdSchema } from "./car.schemas.js";

export async function carRoutes(app: FastifyInstance) {
  app.get("/cars", { schema: getAllSchema }, getAllCars);
  app.get("/cars/:id", { schema: getByIdSchema }, getCarById);
}
