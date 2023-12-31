import S from "fluent-json-schema";

export const addItemSchema = {
  params: S.object().prop("productId", S.string().required()),
};

export const removeItemSchema = addItemSchema;

export const updateItemSchema = {
  body: S.object().prop("quantity", S.number().minimum(1).required()),
  params: S.object().prop("productId", S.string().required()),
};

export const orderSchema = {
  body: S.object().prop("address", S.string().required()),
};
