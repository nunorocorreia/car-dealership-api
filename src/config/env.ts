import { type FastifyInstance } from "fastify";
import fastifyEnv from "@fastify/env";

const schema = {
  type: "object" as const,
  required: ["PORT"],
  properties: {
    PORT: { type: "number" as const, default: 3000 },
    HOST: { type: "string" as const, default: "0.0.0.0" },
    NODE_ENV: {
      type: "string" as const,
      default: "development",
    },
    DATABASE_URL: {
      type: "string" as const,
      default: "./data/dealership.db",
    },
  },
};

declare module "fastify" {
  interface FastifyInstance {
    config: {
      PORT: number;
      HOST: string;
      NODE_ENV: string;
      DATABASE_URL: string;
    };
  }
}

export async function registerEnv(app: FastifyInstance) {
  await app.register(fastifyEnv, { schema, dotenv: true });
}
