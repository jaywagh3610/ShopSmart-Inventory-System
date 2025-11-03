const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    modelName: { type: String, required: true, trim: true },
    company: { type: String, required: true, trim: true, index: true },
    category: { type: String, required: true, trim: true, index: true },
    quantity: { type: Number, required: true, min: 0, default: 0 },
    price: { type: Number, required: true, min: 0 },
  },
  { timestamps: true }
);

productSchema.index({ name: 1, modelName: 1, company: 1 }, { unique: true });

module.exports = mongoose.model("Product", productSchema);
