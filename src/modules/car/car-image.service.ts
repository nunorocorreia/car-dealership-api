import { randomUUID } from "node:crypto";
import { mkdirSync, unlinkSync, existsSync } from "node:fs";
import { writeFile } from "node:fs/promises";
import { join, extname } from "node:path";
import { eq, and } from "drizzle-orm";
import { getDb } from "../../db/index.js";
import { carImages, cars } from "../../db/schema.js";
import type { CarImageResponse } from "../../models/car-image.js";

const UPLOADS_DIR = join(process.cwd(), "uploads", "cars");

function ensureUploadsDir() {
  mkdirSync(UPLOADS_DIR, { recursive: true });
}

function toResponse(
  image: typeof carImages.$inferSelect,
): CarImageResponse {
  return {
    ...image,
    isPrimary: !!image.isPrimary,
    url: `/uploads/cars/${image.filename}`,
  };
}

export async function getImagesByCarId(
  carId: string,
): Promise<CarImageResponse[]> {
  const db = getDb();
  const images = db
    .select()
    .from(carImages)
    .where(eq(carImages.carId, carId))
    .all();

  return images.map(toResponse);
}

export async function uploadImage(
  carId: string,
  fileBuffer: Buffer,
  originalName: string,
  mimeType: string,
): Promise<CarImageResponse> {
  const db = getDb();

  const car = db.select().from(cars).where(eq(cars.id, carId)).get();
  if (!car) {
    throw new NotFoundError("Car not found");
  }

  ensureUploadsDir();

  const id = randomUUID();
  const ext = extname(originalName) || mimeExtension(mimeType);
  const filename = `${carId}-${id}${ext}`;
  const filepath = join(UPLOADS_DIR, filename);

  await writeFile(filepath, fileBuffer);

  const existingImages = db
    .select()
    .from(carImages)
    .where(eq(carImages.carId, carId))
    .all();
  const isPrimary = existingImages.length === 0;

  const image = {
    id,
    carId,
    filename,
    originalName,
    mimeType,
    size: fileBuffer.length,
    isPrimary,
    createdAt: new Date().toISOString(),
  };

  db.insert(carImages).values(image).run();

  return toResponse(image);
}

export async function deleteImage(
  carId: string,
  imageId: string,
): Promise<void> {
  const db = getDb();

  const image = db
    .select()
    .from(carImages)
    .where(and(eq(carImages.id, imageId), eq(carImages.carId, carId)))
    .get();

  if (!image) {
    throw new NotFoundError("Image not found");
  }

  const filepath = join(UPLOADS_DIR, image.filename);
  if (existsSync(filepath)) {
    unlinkSync(filepath);
  }

  db.delete(carImages)
    .where(and(eq(carImages.id, imageId), eq(carImages.carId, carId)))
    .run();

  if (image.isPrimary) {
    const next = db
      .select()
      .from(carImages)
      .where(eq(carImages.carId, carId))
      .limit(1)
      .get();

    if (next) {
      db.update(carImages)
        .set({ isPrimary: true })
        .where(eq(carImages.id, next.id))
        .run();
    }
  }
}

export async function setPrimaryImage(
  carId: string,
  imageId: string,
): Promise<CarImageResponse> {
  const db = getDb();

  const image = db
    .select()
    .from(carImages)
    .where(and(eq(carImages.id, imageId), eq(carImages.carId, carId)))
    .get();

  if (!image) {
    throw new NotFoundError("Image not found");
  }

  db.update(carImages)
    .set({ isPrimary: false })
    .where(eq(carImages.carId, carId))
    .run();

  db.update(carImages)
    .set({ isPrimary: true })
    .where(eq(carImages.id, imageId))
    .run();

  return toResponse({ ...image, isPrimary: true });
}

export class NotFoundError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "NotFoundError";
  }
}

function mimeExtension(mime: string): string {
  const map: Record<string, string> = {
    "image/jpeg": ".jpg",
    "image/png": ".png",
    "image/webp": ".webp",
  };
  return map[mime] ?? ".jpg";
}
