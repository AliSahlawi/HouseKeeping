import mongoose from "mongoose";

const contractSchema = new mongoose.Schema(
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
    endDate: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      required: true,
      default: "active",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Contract", contractSchema);
