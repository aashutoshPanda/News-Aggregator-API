import mongoose from "mongoose";
import chalk from "chalk";

const connectDB = async () => {
  try {
    // MongoDB setup.
    console.log("URI", process.env.MONGODB_URI);
    await mongoose.connect(
      "mongodb+srv://iamashutoshpanda:1k8KAsaD4aD770b8@cluster0.z2wwu5l.mongodb.net/?retryWrites=true&w=majority"
    );
  } catch ({ message }) {
    console.error("Error with mongo setup", message);
    console.log("%s MongoDB connection error. Please make sure MongoDB is running.", chalk.red("✗"));
    // Exit process with failure
    process.exit(1);
  }
};

export default connectDB;
