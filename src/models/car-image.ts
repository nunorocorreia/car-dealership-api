export interface CarImage {
  id: string;
  carId: string;
  filename: string;
  originalName: string;
  mimeType: string;
  size: number;
  isPrimary: boolean;
  createdAt: string;
}

export interface CarImageResponse extends CarImage {
  url: string;
}

export const ALLOWED_MIME_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
] as const;

export const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
