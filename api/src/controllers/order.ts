import { FastifyReply, FastifyRequest } from "fastify";
import { isEmpty, last, map, omit, reduce } from "lodash";
import { Order } from "~/models/order";
import { User } from "~/models/user";

type OrderRequest = FastifyRequest<{
  Body: {
    address: string;
  };
}>;

type GetOrdersRequest = FastifyRequest<{
  Querystring: {
    cursor?: string;
  };
}>;

export const getCheckout = async (req: FastifyRequest, res: FastifyReply) => {
  const authUser = await User.findById(req.user.sub, { cart: true });

  if (isEmpty(authUser?.cart?.items)) {
    res.status(400).send({
      error: "Bad request",
      message: "Empty cart",
    });
    return;
  }

  await authUser?.populate("cart.items.product");

  const cartItems = authUser?.cart?.items;
  const total = reduce(
    cartItems,
    (totalBill, p) => {
      return totalBill + p.product.price * p.quantity;
    },
    0
  ).toFixed(2);

  const items = map(cartItems, (item) => {
    return {
      product: item.product,
      quantity: item.quantity,
      amount: (item.product.price * item.quantity).toFixed(2),
    };
  });

  res.send({ total, items });
};

export const postCheckout = async (req: OrderRequest, res: FastifyReply) => {
  const authUser = await User.findById(req.user.sub, { cart: true });

  await authUser?.populate("cart.items.product");

  const user = authUser?.id;
  const address = req.body.address;
  const cartItems = authUser?.cart?.items;

  if (isEmpty(cartItems)) {
    res.status(400).send({
      error: "Bad request",
      message: "Empty cart",
    });
    return;
  }

  const total = reduce(
    cartItems,
    (totalBill, p) => {
      return totalBill + p.product.price * p.quantity;
    },
    0
  ).toFixed(2);
  const items = map(cartItems, (item) => {
    return {
      product: omit(item.product._doc, ["createdAt", "updatedAt"]),
      quantity: item.quantity,
      amount: (item.product.price * item.quantity).toFixed(2),
    };
  });

  const order = new Order({
    items,
    total,
    address,
    user,
  });
  order.save();

  authUser.cart.items = [];
  authUser.save();

  res.send({ success: true, orderId: order.id });
};

export const getOrders = async (req: GetOrdersRequest, res: FastifyReply) => {
  const withCursor = (c?: string) => (c ? { _id: { $lt: c } } : {});
  const orders = await Order.find({
    user: req.user.sub,
    ...withCursor(req.query.cursor),
  })
    .sort({ _id: -1 })
    .limit(3);

  const lastItem = last(orders);
  const hasNext = lastItem
    ? (await Order.find({
        user: req.user.sub,
        ...withCursor(lastItem.id),
      }).count()) > 0
    : false;

  res.send({
    nextCursor: hasNext ? lastItem?._id : null,
    data: orders,
  });
};
