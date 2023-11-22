import { FastifyReply, FastifyRequest } from "fastify";

export const healthz = async (_: FastifyRequest, res: FastifyReply) => {
  res.status(200).send({ status: "healthy" });
};
