const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: [true, "Full name is required"],
    minlength: [2, "Full name must be at least 2 characters"],
    maxlength: [100, "Full name can have at most 100 characters"],
    trim: true,
  },
  email: {
    type: String,
    required: [true, "Email address is required"],
    unique: true,
    trim: true,
    lowercase: true,
    match: [/^\S+@\S+\.\S+$/, "Invalid email address"],
  },
  password: {
    type: String,
    required: [true, "Password is required"],
    minlength: [8, "Password must be at least 8 characters"],
    maxlength: [100, "Password can have at most 100 characters"],
  },
  role: {
    type: String,
    enum: ["user", "admin"],
    default: "user",
  },
  createdAt: { type: Date, default: Date.now },
  favourites: [{ type: mongoose.Schema.Types.ObjectId, ref: "News" }],
  read: [{ type: mongoose.Schema.Types.ObjectId, ref: "News" }],
});

const User = mongoose.model("User", userSchema);

module.exports = User;
