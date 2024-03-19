import express, { json, urlencoded } from "express";
import { connect } from "mongoose";
import { config } from "dotenv";

config();

const app = express();
app.use(json());
app.use(urlencoded({ extended: false }));

import productRoute from "./routes/product.route.js";
import userRoute from "./routes/user.route.js";
import orderRoute from "./routes/order.route.js";

app.get("/", (req, res) => {
  res.send("Welcome to Planty of Food APIs");
});
app.use("/products", productRoute);
app.use("/users", userRoute);
app.use("/orders", orderRoute);

const dbUrl = `mongodb+srv://${process.env.USERNAME}:${process.env.PASSWORD}@${process.env.HOST}/${process.env.DB_NAME}?retryWrites=true&w=majority`;

connect(dbUrl)
  .then(() => {
    console.log("Connected to database");
    app.listen(3000, () => {
      console.log("Server is listening on port 3000");
    });
  })
  .catch((error) => {
    console.log("Error connecting to database", error);
  });
