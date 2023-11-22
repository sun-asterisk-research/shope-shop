import fastifyJwt, { JWT } from "@fastify/jwt";
import fastifyCookie from "@fastify/cookie";
import {
  FastifyInstance,
  FastifyReply,
  FastifyRequest,
  RouteHandler,
} from "fastify";
import fp from "fastify-plugin";
import { config } from "~/config";

export interface JwtPayload {
  sub: string;
  prefered_username: string;
  picture: string | null;
  aud: string;
  exp: number;
  iat: number;
}

declare module "fastify" {
  interface FastifyInstance {
    authenticate: RouteHandler;
  }
  interface FastifyRequest {
    jwt: JWT;
  }
}

declare module "@fastify/jwt" {
  interface FastifyJWT {
    payload: JwtPayload;
    user: JwtPayload;
  }
}

const jwtPlugin = fp(async (fastify: FastifyInstance) => {
  fastify.register(fastifyJwt, {
    secret: config.JWT_SECRET,
    cookie: {
      cookieName: "shope_auth",
      signed: false,
    },
  });

  fastify.register(fastifyCookie);

  /**
   * Authenticated or send error
   */
  fastify.decorate(
    "authenticate",
    async (request: FastifyRequest, reply: FastifyReply) => {
      try {
        await request.jwtVerify();
      } catch (err) {
        reply.send(err);
      }
    }
  );

  fastify.decorate(
    "authUser",
    async (req: FastifyRequest, res: FastifyReply) => {
      if (!req.user) {
        res.status(401).send({
          error: "Unauthorized",
          message: "No Authorization was found in request.headers",
        });
        return;
      }
    }
  );

  fastify.decorateRequest("jwt", { getter: () => fastify.jwt });
});

export default jwtPlugin;
