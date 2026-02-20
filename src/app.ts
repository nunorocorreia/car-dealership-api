import Fastify from "fastify";
import { registerEnv } from "./config/env.js";
import { registerCors } from "./plugins/cors.js";
import { registerSwagger } from "./plugins/swagger.js";
import { initDb } from "./db/index.js";
import { healthRoutes } from "./routes/health.js";
import { carRoutes } from "./modules/car/car.routes.js";
import { leadRoutes } from "./modules/lead/lead.routes.js";

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

  initDb(app.config.DATABASE_URL);
  app.log.info(`Database initialized at ${app.config.DATABASE_URL}`);

  await app.register(healthRoutes);
  await app.register(carRoutes);
  await app.register(leadRoutes);

  return app;
}
