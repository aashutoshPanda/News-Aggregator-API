import mongoose, { Schema } from "mongoose";

const categoryNewsSchema = new Schema({
  categoryId: { type: mongoose.Schema.Types.ObjectId, ref: "Category" },
  newsId: { type: mongoose.Schema.Types.ObjectId, ref: "News" },
});

const CategoryNews = mongoose.model("CategoryNews", categoryNewsSchema);

export default CategoryNews;
