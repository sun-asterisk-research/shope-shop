import { FastifyInstance } from "fastify";
import { getLatestProducts, getProduct } from "~/controllers/product";

export default async (fastify: FastifyInstance) => {
  fastify.get("/products/latest", getLatestProducts);
  fastify.get("/products/:productId", getProduct);
};
