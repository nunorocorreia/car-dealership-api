import type { FastifyReply, FastifyRequest } from "fastify";
import type { CreateLeadInput } from "../../models/lead.js";
import * as leadService from "./lead.service.js";
import { CarNotFoundError } from "./lead.service.js";

export async function getAllLeads() {
  return leadService.getAll();
}

export async function createLead(
  request: FastifyRequest<{ Body: CreateLeadInput }>,
  reply: FastifyReply,
) {
  try {
    const lead = await leadService.create(request.body);
    return reply.code(201).send(lead);
  } catch (error) {
    if (error instanceof CarNotFoundError) {
      return reply.code(404).send({ message: error.message });
    }
    throw error;
  }
}
