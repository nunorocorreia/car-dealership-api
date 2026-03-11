import type { FastifyReply, FastifyRequest } from "fastify";
import type { CreateRuleInput, UpdateRuleInput } from "./discount.service.js";
import * as discountService from "./discount.service.js";
import { RuleNotFoundError, CarNotFoundError } from "./discount.service.js";

export async function getAllRules() {
  return discountService.getAllRules();
}

export async function createRule(
  request: FastifyRequest<{ Body: CreateRuleInput }>,
  reply: FastifyReply,
) {
  const rule = await discountService.createRule(request.body);
  return reply.code(201).send(rule);
}

export async function updateRule(
  request: FastifyRequest<{ Params: { id: string }; Body: UpdateRuleInput }>,
  reply: FastifyReply,
) {
  try {
    return await discountService.updateRule(request.params.id, request.body);
  } catch (err) {
    if (err instanceof RuleNotFoundError) {
      return reply.code(404).send({ message: err.message });
    }
    throw err;
  }
}

export async function deleteRule(
  request: FastifyRequest<{ Params: { id: string } }>,
  reply: FastifyReply,
) {
  try {
    await discountService.deleteRule(request.params.id);
    return reply.code(204).send();
  } catch (err) {
    if (err instanceof RuleNotFoundError) {
      return reply.code(404).send({ message: err.message });
    }
    throw err;
  }
}

export async function setCarDiscount(
  request: FastifyRequest<{ Params: { id: string }; Body: { amount: number | null } }>,
  reply: FastifyReply,
) {
  try {
    await discountService.setCarDiscount(request.params.id, request.body.amount);
    return { message: request.body.amount ? "Discount set" : "Discount cleared" };
  } catch (err) {
    if (err instanceof CarNotFoundError) {
      return reply.code(404).send({ message: err.message });
    }
    throw err;
  }
}
