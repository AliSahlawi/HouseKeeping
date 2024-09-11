import mongoose from "mongoose";
import validator from "validator";

const customerSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: [true, "First Name is Required!"],
    },
    lastName: {
      type: String,
      required: [true, "Last Name is Required!"],
    },
    phone: {
      type: String,
      unique: true,
      required: [true, "Email is Required!"],
    },
    city: {
      type: String,
      required: [true, "City is Required!"],
    },
    house: {
      type: String,
      required: [true, "House is Required!"],
    },
    street: {
      type: String,
      required: [true, "Street is Required!"],
    },
    block: {
      type: String,
      required: [true, "Block is Required!"],
    },
  },
  { timestamps: true }
);

export default mongoose.model("Customer", customerSchema);
