import mongoose from "mongoose";

const customerSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: [true, "Full name is required"],
      trim: true
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password must be at least 6 characters"]
    },
    phone: {
      type: String,
      required: [true, "Phone number is required"],
      trim: true
    },
    // Lab-04: Wishlist System - References Product ObjectIds only
    wishlist: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product"
      }
    ],
    // Lab-05: Shopping Cart - Product reference + quantity
    cart: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true
        },
        quantity: {
          type: Number,
          required: true,
          default: 1,
          min: [1, "Quantity must be at least 1"]
        }
      }
    ]
  },
  {
    timestamps: true
  }
);

// Register both Customer and User models for complete compatibility across all labs
const Customer = mongoose.models.Customer || mongoose.model("Customer", customerSchema);
if (!mongoose.models.User) {
  mongoose.model("User", customerSchema);
}

export default Customer;
