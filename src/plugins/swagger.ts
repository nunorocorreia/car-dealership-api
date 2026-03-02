import type { FastifyInstance } from "fastify";
import swagger from "@fastify/swagger";
import swaggerUi from "@fastify/swagger-ui";

export async function registerSwagger(app: FastifyInstance) {
  await app.register(swagger, {
    openapi: {
      info: {
        title: "Car Dealership API",
        description: "REST API for a car dealership -- browse inventory, submit leads, record sales",
        version: "1.0.0",
      },
      tags: [
        { name: "Cars", description: "Browse car inventory" },
        { name: "Leads", description: "Customer lead management" },
        { name: "Sales", description: "Sale transactions and history" },
        { name: "Health", description: "Service health checks" },
      ],
    },
  });

  await app.register(swaggerUi, {
    routePrefix: "/docs",
  });
}
