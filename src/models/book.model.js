import mongoose from "mongoose";

const bookSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      index: true
    },
    author: {
      type: String,
      required: true,
      index: true
    },
    genre: {
      type: String,
      required: true,
      index: true
    },
    description: String,
    price: {
      type: Number,
      required: true,
      min: 0
    },
    stock: {
      type: Number,
      required: true,
      min: 0
    },
    ratingAvg: {
      type: Number,
      default: 0
    }
  },
  { timestamps: true }
);

bookSchema.index({ title: "text", author: "text" });

export default mongoose.model("Book", bookSchema);
