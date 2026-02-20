import Fastify from "fastify";
import { registerEnv } from "./config/env.js";
import { registerCors } from "./plugins/cors.js";
import { healthRoutes } from "./routes/health.js";
import { carRoutes } from "./modules/car/car.routes.js";

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

  await app.register(healthRoutes);
  await app.register(carRoutes);

  return app;
}
