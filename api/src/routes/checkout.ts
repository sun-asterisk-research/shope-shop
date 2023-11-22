import { FastifyInstance } from "fastify";
import { getCheckout, getOrders, postCheckout } from "~/controllers/order";
import { orderSchema } from "~/schemas/cart";

export default async (fastify: FastifyInstance) => {
  fastify.get(
    "/cart/checkout",
    { onRequest: [fastify.authenticate] },
    getCheckout
  );
  fastify.post(
    "/cart/checkout",
    { schema: orderSchema, onRequest: [fastify.authenticate] },
    postCheckout
  );
  fastify.get("/orders", { onRequest: [fastify.authenticate] }, getOrders);
};
