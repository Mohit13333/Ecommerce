import mongoose from "mongoose";
const { Schema } = mongoose;

const paymentMethods = {
  values: ["card", "cash"],
  message: "Invalid payment method. Must be either card or cash.",
};

const orderSchema = new Schema(
  {
    items: [
      {
        productId: {
          type: Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        quantity: { type: Number, required: true, min: 1 }, 
        price: { type: Number, required: true, min: 0 }, 
      },
    ],
    totalAmount: { type: Number, required: true, min: 0 }, 
    totalItems: { type: Number, required: true, min: 0 }, 
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    paymentMethod: {
      type: String,
      required: true,
      enum: paymentMethods.values,
    },
    paymentStatus: {
      type: String,
      default: "pending",
      enum: ["pending", "failed", "received","refunded"],
    },

    status: {
      type: String,
      default: "pending",
      enum: ["pending", "shipped", "delivered", "canceled", "failed"],
    },

    selectedAddress: { type: Schema.Types.Mixed, required: true },
  },
  { timestamps: true }
);

orderSchema.virtual("id").get(function () {
  return this._id.toString
});

orderSchema.set("toJSON", {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) {
    delete ret._id; 
    return ret; 
  },
});


export const Order = mongoose.model("Order", orderSchema);
