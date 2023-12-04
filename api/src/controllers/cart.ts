import { FastifyReply, FastifyRequest } from "fastify";
import { Product } from "~/models/product";
import { User } from "~/models/user";
import { clamp } from "lodash";

type AddItemRequest = FastifyRequest<{
  Params: {
    productId: string;
  };
}>;

type RemoveItemRequest = AddItemRequest;

type UpdateItemRequest = FastifyRequest<{
  Body: {
    quantity: number;
  };
  Params: {
    productId: string;
  };
}>;

export const listItems = async (req: FastifyRequest, res: FastifyReply) => {
  const authUser = await User.findById(req.user.sub, { cart: true });

  await authUser?.populate("cart.items.product");

  const items = authUser?.cart?.items || [];

  res.send({ items });
};

export const addItem = async (req: AddItemRequest, res: FastifyReply) => {
  const authUser = await User.findById(req.user.sub);
  const product = await Product.findById(req.params.productId);

  if (!product || !authUser) {
    res.status(400).send({
      error: "Bad request",
      message: "Product not found",
    });
    return;
  }

  if (!authUser.cart) {
    authUser.cart = { items: [] };
  }

  const idx = authUser.cart.items.findIndex(
    (p) => p.product.toString() === product._id.toString()
  );

  if (idx < 0) {
    authUser.cart.items.push({
      product: product._id,
      quantity: 1,
    });
  } else {
    authUser.cart.items[idx].quantity += 1;
  }

  authUser.save();

  res.send({ success: true, count: authUser.cart.items.length });
};

export const removeItem = async (req: RemoveItemRequest, res: FastifyReply) => {
  const authUser = await User.findById(req.user.sub);
  const product = await Product.findById(req.params.productId);

  if (!product || !authUser || !authUser.cart?.items) {
    res.status(400).send({
      error: "Bad request",
      message: "Product not found",
    });
    return;
  }

  const idx = authUser.cart.items.findIndex(
    (p) => p.product.toString() === product._id.toString()
  );

  if (idx >= 0) {
    const newQuantity = clamp(
      0,
      authUser.cart.items[idx].quantity - 1,
      authUser.cart.items[idx].quantity - 1
    );
    if (newQuantity > 0) {
      authUser.cart.items[idx].quantity = newQuantity;
    } else {
      authUser.cart.items = authUser.cart.items.filter(
        (item) => item.product.toString() !== req.params.productId
      );
    }
    authUser.save();
  }

  res.send({ success: true, count: authUser.cart.items.length });
};

export const deleteItem = async (req: RemoveItemRequest, res: FastifyReply) => {
  const authUser = await User.findById(req.user.sub);
  const product = await Product.findById(req.params.productId);

  if (!product || !authUser || !authUser.cart?.items) {
    res.status(400).send({
      error: "Bad request",
      message: "Product not found",
    });
    return;
  }

  authUser.cart.items = authUser.cart.items.filter(
    (item) => item.product.toString() !== req.params.productId
  );
  authUser.save();

  res.send({ success: true });
};

export const updateItem = async (req: UpdateItemRequest, res: FastifyReply) => {
  const authUser = await User.findById(req.user.sub);
  const product = await Product.findById(req.params.productId);

  if (!authUser || !product || !authUser.cart?.items) {
    res.status(400).send({
      error: "Bad request",
      message: "Product not found",
    });
    return;
  }

  const idx = authUser.cart.items.findIndex(
    (p) => p.product.toString() === req.params.productId
  );
  if (idx >= 0) {
    authUser.cart.items[idx].quantity = clamp(
      req.body.quantity,
      1,
      req.body.quantity
    );

    authUser.save();
  }

  res.send({ success: true });
};

export const resetCart = async (req: FastifyRequest, res: FastifyReply) => {
  const authUser = await User.findById(req.user.sub);

  if (!authUser) {
    res.status(400).send({
      error: "Bad request",
      message: "Product not found",
    });
    return;
  }

  authUser.cart = { items: [] };
  authUser.save();

  res.send({ success: true });
};
