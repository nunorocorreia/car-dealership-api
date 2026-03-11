import type { FastifyInstance } from "fastify";
import { getAllCars, getCarById } from "./car.handlers.js";
import { getAllSchema, getByIdSchema } from "./car.schemas.js";
import {
  getImages,
  uploadImage,
  deleteImage,
  setPrimaryImage,
} from "./car-image.handlers.js";
import {
  getImagesSchema,
  uploadImageSchema,
  deleteImageSchema,
  setPrimarySchema,
} from "./car-image.schemas.js";

export async function carRoutes(app: FastifyInstance) {
  app.get("/cars", { schema: getAllSchema }, getAllCars);
  app.get("/cars/:id", { schema: getByIdSchema }, getCarById);

  app.get("/cars/:id/images", { schema: getImagesSchema }, getImages);
  app.post("/cars/:id/images", { schema: uploadImageSchema }, uploadImage);
  app.delete(
    "/cars/:id/images/:imageId",
    { schema: deleteImageSchema },
    deleteImage,
  );
  app.patch(
    "/cars/:id/images/:imageId/primary",
    { schema: setPrimarySchema },
    setPrimaryImage,
  );
}
