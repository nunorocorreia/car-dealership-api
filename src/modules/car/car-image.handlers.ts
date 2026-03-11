import type { FastifyRequest, FastifyReply } from "fastify";
import {
  ALLOWED_MIME_TYPES,
  MAX_FILE_SIZE,
} from "../../models/car-image.js";
import * as imageService from "./car-image.service.js";
import { NotFoundError } from "./car-image.service.js";

type CarParams = { Params: { id: string } };
type ImageParams = { Params: { id: string; imageId: string } };

export async function getImages(
  request: FastifyRequest<CarParams>,
  reply: FastifyReply,
) {
  try {
    return await imageService.getImagesByCarId(request.params.id);
  } catch (err) {
    if (err instanceof NotFoundError) {
      return reply.code(404).send({ message: err.message });
    }
    throw err;
  }
}

export async function uploadImage(
  request: FastifyRequest<CarParams>,
  reply: FastifyReply,
) {
  try {
    const file = await request.file();

    if (!file) {
      return reply.code(400).send({ message: "No file uploaded" });
    }

    if (!ALLOWED_MIME_TYPES.includes(file.mimetype as any)) {
      return reply.code(400).send({
        message: `Invalid file type. Allowed: ${ALLOWED_MIME_TYPES.join(", ")}`,
      });
    }

    const buffer = await file.toBuffer();

    if (buffer.length > MAX_FILE_SIZE) {
      return reply.code(400).send({
        message: `File too large. Maximum size: ${MAX_FILE_SIZE / 1024 / 1024}MB`,
      });
    }

    const image = await imageService.uploadImage(
      request.params.id,
      buffer,
      file.filename,
      file.mimetype,
    );

    return reply.code(201).send(image);
  } catch (err) {
    if (err instanceof NotFoundError) {
      return reply.code(404).send({ message: err.message });
    }
    throw err;
  }
}

export async function deleteImage(
  request: FastifyRequest<ImageParams>,
  reply: FastifyReply,
) {
  try {
    await imageService.deleteImage(request.params.id, request.params.imageId);
    return reply.code(204).send();
  } catch (err) {
    if (err instanceof NotFoundError) {
      return reply.code(404).send({ message: err.message });
    }
    throw err;
  }
}

export async function setPrimaryImage(
  request: FastifyRequest<ImageParams>,
  reply: FastifyReply,
) {
  try {
    return await imageService.setPrimaryImage(
      request.params.id,
      request.params.imageId,
    );
  } catch (err) {
    if (err instanceof NotFoundError) {
      return reply.code(404).send({ message: err.message });
    }
    throw err;
  }
}
