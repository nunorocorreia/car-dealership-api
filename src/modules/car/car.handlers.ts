import type { FastifyReply, FastifyRequest } from "fastify";
import type { CarQuery } from "../../models/car.js";
import * as carService from "./car.service.js";

export async function getAllCars(
  request: FastifyRequest<{ Querystring: CarQuery }>,
) {
  return carService.getAll(request.query);
}

export async function getCarById(
  request: FastifyRequest<{ Params: { id: string } }>,
  reply: FastifyReply,
) {
  const car = await carService.getById(request.params.id);

  if (!car) {
    return reply.code(404).send({ message: "Car not found" });
  }

  return car;
}
