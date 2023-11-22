import { FastifyInstance } from "fastify";
import { login, authUser, register } from "~/controllers/auth";
import { loginSchema, registerSchema } from "~/schemas/auth";

export default async (fastify: FastifyInstance) => {
  fastify.get("/auth/user", { onRequest: [fastify.authenticate] }, authUser);
  fastify.post("/auth/login", { schema: loginSchema }, login);
  fastify.post("/auth/register", { schema: registerSchema }, register);
};
