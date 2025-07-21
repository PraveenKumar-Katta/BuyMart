const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  img: {
    type: String,
    required: true,
    match: /^https?:\/\/.+\.(jpg|jpeg|png|webp|svg)$/, // basic image URL validation
  }
}, { timestamps: true });

const CategoryModel = mongoose.model("Category", categorySchema);

module.exports = CategoryModel;
