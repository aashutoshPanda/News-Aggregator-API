import mongoose, { Schema } from "mongoose";

const newsSchema = new Schema({
  title: {
    type: String,
    required: [true, "News title is required"],
    minlength: [2, "News title must be at least 2 characters"],
    maxlength: [200, "News title can have at most 200 characters"],
    trim: true,
  },
  content: {
    type: String,
    required: false,
    minlength: [10, "News content must be at least 10 characters"],
  },
  url: {
    type: String,
    required: [true, "News URL is required"],
    match: [/^https?:\/\/.+/, "Invalid URL format"],
  },
  publishedAt: { type: Date, default: Date.now },
  author: {
    type: String,
    required: [true, "News author is required"],
    minlength: [2, "News author must be at least 2 characters"],
    maxlength: [100, "News author can have at most 100 characters"],
    trim: true,
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
  },
});

newsSchema.methods.addCategory = async function (categoryId) {
  this.categories.addToSet(categoryId);
  await this.save();
  await CategoryNews.create({ categoryId, newsId: this._id });
};

newsSchema.methods.removeCategory = async function (categoryId) {
  this.categories.pull(categoryId);
  await this.save();
  await CategoryNews.findOneAndDelete({ categoryId, newsId: this._id });
};

const News = mongoose.model("News", newsSchema);
export default News;
