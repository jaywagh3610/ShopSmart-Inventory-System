const express = require("express");
const productRoutes = require("./routers/productRouter");
const globalErrorHandler = require("./Middleware/errorHandler");
const userRoute = require("./routers/userRouter");
const AppError = require("./utils/appError");
const connectDb = require("./config/db");
connectDb();

const app = express();

app.use(express.json());
app.use("/user", userRoute);
app.use("/products", productRoutes);

// app.all("*", (req, res, next) => {
//   next(new AppError(`Can't find ${req.originalUrl} on this server`, 404));
// });

app.use(globalErrorHandler);

module.exports = app;
