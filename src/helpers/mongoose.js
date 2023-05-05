import mongoose from "mongoose";

const connectDB = async () => {
  if (process.env.NODE_ENV != "TEST") {
    try {
      // MongoDB setup.
      await mongoose.connect(process.env.MONGODB_URI);
    } catch ({ message }) {
      console.error("Error with mongo setup", message);
      console.log("%s MongoDB connection error. Please make sure MongoDB is running.");
      // Exit process with failure
      process.exit(1);
    }
  }
};

export default connectDB;
