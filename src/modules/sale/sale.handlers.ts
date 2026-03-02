import type { FastifyReply, FastifyRequest } from "fastify";
import type { CreateSaleInput } from "../../models/sale.js";
import * as saleService from "./sale.service.js";
import {
  CarNotFoundError,
  CarNotAvailableError,
  LeadNotFoundError,
} from "./sale.service.js";

export async function getAllSales() {
  return saleService.getAll();
}

export async function getSaleById(
  request: FastifyRequest<{ Params: { id: string } }>,
  reply: FastifyReply,
) {
  const sale = await saleService.getById(request.params.id);

  if (!sale) {
    return reply.code(404).send({ message: "Sale not found" });
  }

  return sale;
}

export async function createSale(
  request: FastifyRequest<{ Body: CreateSaleInput }>,
  reply: FastifyReply,
) {
  try {
    const sale = await saleService.create(request.body);
    return reply.code(201).send(sale);
  } catch (error) {
    if (error instanceof CarNotFoundError) {
      return reply.code(404).send({ message: error.message });
    }
    if (error instanceof LeadNotFoundError) {
      return reply.code(404).send({ message: error.message });
    }
    if (error instanceof CarNotAvailableError) {
      return reply.code(409).send({ message: error.message });
    }
    throw error;
  }
}
