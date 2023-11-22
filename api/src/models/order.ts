import * as mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    items: [
      {
        product: { type: Object, required: true },
        quantity: { type: Number, required: true },
        amount: { type: Number, required: true },
      },
    ],
    total: { type: Number, required: true },
    address: { type: String, required: true },
    user: {
      type: mongoose.Schema.ObjectId,
      required: true,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

export type Order = mongoose.InferSchemaType<typeof orderSchema>;
export const Order = mongoose.model("Order", orderSchema);
