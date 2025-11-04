const express = require("express");
const productRoutes = require("./routers/productRouter");
const globalErrorHandler = require("./Middleware/errorHandler");
const userRoute = require("./routers/userRouter");
const orderRoutes = require("./routers/orderRouter");

const path = require("path");
const connectDb = require("./config/db");
connectDb();

const app = express();

app.use(express.json());
app.use("/user", userRoute);
app.use("/api/products", productRoutes);
app.use("/api/order", orderRoutes);
app.get("/", (req, res) => {
  res.send("ShopSmart Inventory System API is running ");
});

app.use(express.static(path.join(__dirname, "Html")));

app.get("/signup", (req, res) => {
  res.sendFile(path.resolve(__dirname, "/Html/registration.html"));
});
app.get("/login", (req, res) => {
  console.log("hii");
  res.sendFile(path.join(__dirname, "/Html/login.html"));
});
app.get("/home", (req, res) => {
  res.sendFile(path.join(__dirname, "/Html/Home.html"));
});
app.get("/admin-panel", (req, res) => {
  res.sendFile(path.join(__dirname, "/Html/index.html"));
});
app.get("/products", (req, res) => {
  res.sendFile(path.join(__dirname, "/Html/products.html"));
});
app.get("/orders", (req, res) => {
  res.sendFile(path.join(__dirname, "/Html/orders.html"));
});

app.use(globalErrorHandler);

module.exports = app;
