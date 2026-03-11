import { join } from "node:path";
import Fastify from "fastify";
import fastifyMultipart from "@fastify/multipart";
import fastifyStatic from "@fastify/static";
import { registerEnv } from "./config/env.js";
import { registerCors } from "./plugins/cors.js";
import { registerSwagger } from "./plugins/swagger.js";
import { initDb } from "./db/index.js";
import { healthRoutes } from "./routes/health.js";
import { carRoutes } from "./modules/car/car.routes.js";
import { leadRoutes } from "./modules/lead/lead.routes.js";
import { saleRoutes } from "./modules/sale/sale.routes.js";
import { statsRoutes } from "./modules/stats/stats.routes.js";

export async function buildApp() {
  const app = Fastify({
    logger: {
      transport: {
        target: "pino-pretty",
        options: { colorize: true },
      },
    },
  });

  await registerEnv(app);
  await registerCors(app);
  await registerSwagger(app);

  await app.register(fastifyMultipart, {
    limits: { fileSize: 5 * 1024 * 1024 },
  });

  await app.register(fastifyStatic, {
    root: join(process.cwd(), "uploads"),
    prefix: "/uploads/",
    decorateReply: false,
  });

  initDb(app.config.DATABASE_URL);
  app.log.info(`Database initialized at ${app.config.DATABASE_URL}`);

  await app.register(healthRoutes);
  await app.register(carRoutes);
  await app.register(leadRoutes);
  await app.register(saleRoutes);
  await app.register(statsRoutes);

  return app;
}
