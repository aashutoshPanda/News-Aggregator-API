const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Category name is required"],
    minlength: [2, "Category name must be at least 2 characters"],
    maxlength: [100, "Category name can have at most 100 characters"],
    trim: true,
  },
  lastUpdated: { type: Date, default: Date.now },
});

const Category = mongoose.model("Category", categorySchema);

module.exports = Category;
