import mongoose from "mongoose";

const workerSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    timings: {
      type: Array,
      required: true,
    },
    feePerHour: {
      type: Number,
      required: true,
    },
    isActive: { 
      type:Boolean,
      default: true
    },
    
  },
  { timestamps: true }
);

export default mongoose.model("Worker", workerSchema);
