const carImageSchema = {
  type: "object" as const,
  properties: {
    id: { type: "string" as const },
    carId: { type: "string" as const },
    filename: { type: "string" as const },
    originalName: { type: "string" as const },
    mimeType: { type: "string" as const },
    size: { type: "number" as const },
    isPrimary: { type: "boolean" as const },
    createdAt: { type: "string" as const },
    url: { type: "string" as const },
  },
};

const carIdParams = {
  type: "object" as const,
  required: ["id"] as const,
  properties: {
    id: { type: "string" as const },
  },
};

const imageIdParams = {
  type: "object" as const,
  required: ["id", "imageId"] as const,
  properties: {
    id: { type: "string" as const },
    imageId: { type: "string" as const },
  },
};

const notFoundResponse = {
  type: "object" as const,
  properties: {
    message: { type: "string" as const },
  },
};

export const getImagesSchema = {
  tags: ["Car Images"],
  summary: "List car images",
  description: "Get all images for a specific car",
  params: carIdParams,
  response: {
    200: {
      type: "array" as const,
      items: carImageSchema,
    },
    404: notFoundResponse,
  },
};

export const uploadImageSchema = {
  tags: ["Car Images"],
  summary: "Upload car image",
  description:
    "Upload an image for a car. Accepts JPEG, PNG, or WebP up to 5MB. First image is automatically set as primary.",
  consumes: ["multipart/form-data"],
  params: carIdParams,
  response: {
    201: carImageSchema,
    400: notFoundResponse,
    404: notFoundResponse,
  },
};

export const deleteImageSchema = {
  tags: ["Car Images"],
  summary: "Delete car image",
  description:
    "Delete a specific image. If the deleted image was primary, the next available image becomes primary.",
  params: imageIdParams,
  response: {
    204: { type: "null" as const },
    404: notFoundResponse,
  },
};

export const setPrimarySchema = {
  tags: ["Car Images"],
  summary: "Set primary image",
  description: "Set an image as the primary image for a car",
  params: imageIdParams,
  response: {
    200: carImageSchema,
    404: notFoundResponse,
  },
};
