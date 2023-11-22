import { FastifyInstance } from "fastify";
import { healthz } from "~/controllers/healthcheck";

export default async (fastify: FastifyInstance) => {
  fastify.get("/healthz", healthz);
};
