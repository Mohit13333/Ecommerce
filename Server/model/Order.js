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
        quantity: { type: Number, required: true, min: 1 }, // Ensuring quantity is at least 1
        price: { type: Number, required: true, min: 0 }, // Price should be non-negative
      },
    ],
    totalAmount: { type: Number, required: true, min: 0 }, // Ensure totalAmount is non-negative
    totalItems: { type: Number, required: true, min: 0 }, // Ensure totalItems is non-negative
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
    }, // Added received

    status: {
      type: String,
      default: "pending",
      enum: ["pending", "shipped", "delivered", "canceled", "failed"],
    },

    selectedAddress: { type: Schema.Types.Mixed, required: true },
  },
  { timestamps: true }
);

// Virtual for id
orderSchema.virtual("id").get(function () {
  return this._id.toString(); // Ensure id is returned as a string
});

// Set toJSON options
orderSchema.set("toJSON", {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) {
    delete ret._id; // Remove _id
    return ret; // Return the transformed object
  },
});

// Create the model
export const Order = mongoose.model("Order", orderSchema);
