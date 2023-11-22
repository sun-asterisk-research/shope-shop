import { FastifyReply, FastifyRequest } from "fastify";
import { clamp, last } from "lodash";
import { Product } from "~/models/product";

type LatestProductRequest = FastifyRequest<{
  Querystring: {
    limit?: number;
    cursor?: string;
    q?: string;
  };
}>;

type GetProductRequest = FastifyRequest<{
  Params: {
    productId: string;
  };
}>;

export const getLatestProducts = async (
  req: LatestProductRequest,
  res: FastifyReply
) => {
  const limit = clamp(req.query.limit || 12, 1, 100);
  const withCursor = (c?: string) => (c ? { _id: { $lt: c } } : {});
  const withSearch = (q?: string) =>
    q ? { title: { $regex: `.*${req.query.q}.*` } } : {};

  const products = await Product.find({
    ...withCursor(req.query.cursor),
    ...withSearch(req.query.q),
  })
    .sort({ _id: -1 })
    .limit(limit);

  const lastItem = last(products);
  const hasNext = lastItem
    ? (await Product.find({ ...withCursor(lastItem.id) }).count()) > 0
    : false;

  res.send({
    nextCursor: hasNext ? lastItem?.id : null,
    data: products,
  });
};

export const getProduct = async (req: GetProductRequest, res: FastifyReply) => {
  const product = await Product.findOne({ _id: req.params.productId });
  res.send(product);
};
