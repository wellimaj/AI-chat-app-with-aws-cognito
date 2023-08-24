import { App } from "./app";
import { HomeController } from "./controllers/home.controller";
import { AuthController } from "./controllers/auth.controller";
import { ProtectedController } from "./controllers/Protected.controller";
import cors from "cors";
import dotenv from "dotenv";

import bodyParser from "body-parser";
dotenv.config();
const app = new App({
  port: 3000,
  controllers: [
    new HomeController(),
    new AuthController(),
    new ProtectedController(),
  ],
  middlewares: [
    bodyParser.json(),
    bodyParser.urlencoded({ extended: true }),
    cors(),
  ],
});
app.listen();
const mongoose = require("mongoose");

// Replace 'my-database-name' with your actual database name
const dbURI = "mongodb://localhost:27017/my-database-name";

mongoose.connect(dbURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

export const db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error:"));
db.once("open", () => {
  console.log("Connected to MongoDB");
});
