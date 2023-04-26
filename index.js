import express from "express";
import logger from "morgan";
import dotenv from "dotenv";
import connectDB from "./src/helpers/mongoose.js";
import routes from "./src/routes/index.js";

// Make all variables from our .env file available in our process
dotenv.config({ path: ".env.example" });

// Init express server
const app = express();

console.log("URI", process.env.MONGODB_URI);
// Connect to MongoDB.
connectDB();

// Middlewares & configs setup
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Here we define the api routes
app.use(routes);

const port = process.env.PORT || 8080;
const address = process.env.SERVER_ADDRESS || "localhost";

app.get("/", (req, res) => res.send("Hello World!"));

app.listen(port, () =>
  console.log(`Server running on http://${address}:${port}`)
);
