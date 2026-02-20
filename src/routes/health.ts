import { type FastifyInstance } from "fastify";

export async function healthRoutes(app: FastifyInstance) {
  app.get(
    "/health",
    {
      schema: {
        tags: ["Health"],
        summary: "Health check",
        response: {
          200: {
            type: "object" as const,
            properties: {
              status: { type: "string" as const },
              timestamp: { type: "string" as const },
            },
          },
        },
      },
    },
    async () => {
      return { status: "ok", timestamp: new Date().toISOString() };
    },
  );
}
