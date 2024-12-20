import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema(
  {
    customerId: {
      type: String,
      required: true,
    },
    workerId: {
      type: String,
      required: true,
    },
    workerInfo: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Worker",
    },
    customerInfo: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Customer",
    },
    date: {
      type: Array,
      required: true,
    },
    status: {
      type: String,
      required: true,
      default: "approved",
    },
    time: {
      type: Array,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    contractId:{
      type: String,
      required: false,
      default: undefined
    }
  },
  { timestamps: true }
);

export default mongoose.model("Booking", bookingSchema);
