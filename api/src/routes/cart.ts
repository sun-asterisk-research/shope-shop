import { FastifyInstance } from "fastify";
import {
  addItem,
  removeItem,
  resetCart,
  listItems,
  updateItem,
} from "~/controllers/cart";
import {
  addItemSchema,
  removeItemSchema,
  updateItemSchema,
} from "~/schemas/cart";

export default async (fastify: FastifyInstance) => {
  fastify.register(
    async (group) => {
      group.addHook("onRequest", fastify.authenticate);

      group.get("/", listItems);
      group.delete("/", resetCart);

      group.post("/item/:productId", { schema: addItemSchema }, addItem);
      group.delete(
        "/item/:productId",
        { schema: removeItemSchema },
        removeItem
      );
      group.put("/item/:productId", { schema: updateItemSchema }, updateItem);
    },
    { prefix: "/cart" }
  );
};
