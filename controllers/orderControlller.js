const Order = require("../Models/orderSchema");
const Product = require("../Models/productModel");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");

exports.placeOrder = catchAsync(async (req, res, next) => {
  const userId = req.user.id;
  const { items, address } = req.body;

  if (!items || !Array.isArray(items) || items.length === 0) {
    return next(new AppError("No items in order", 400));
  }
  if (!address) {
    return next(new AppError("Address is required", 400));
  }

  let totalAmount = 0;
  const orderItems = [];

  for (const item of items) {
    const product = await Product.findById(item.product);
    if (!product) return next(new AppError("Product not found", 404));
    if (product.quantity < item.quantity)
      return next(new AppError(`Not enough stock for ${product.name}`, 400));

    product.quantity -= item.quantity;
    await product.save();

    const price = product.price * item.quantity;
    totalAmount += price;

    orderItems.push({
      product: product._id,
      quantity: item.quantity,
      price: product.price,
    });
  }

  const order = await Order.create({
    user: userId,
    items: orderItems,
    totalAmount,
    address,
  });

  res.status(201).json({
    success: true,
    message: "Order placed successfully",
    data: order,
  });
});

exports.getAllOrders = catchAsync(async (req, res, next) => {
  const orders = await Order.find().populate("user", "name email");
  res.status(200).json({ success: true, data: orders });
});

exports.getUserOrders = catchAsync(async (req, res, next) => {
  const orders = await Order.find({ user: req.user.id })
    .populate("items.product")
    .sort("-createdAt");

  res.status(200).json({ success: true, data: orders });
});

exports.updateOrderStatus = catchAsync(async (req, res, next) => {
  const { status, paymentStatus } = req.body;
  const order = await Order.findById(req.params.id);
  if (!order) return next(new AppError("Order not found", 404));

  if (status) order.status = status;
  if (paymentStatus) order.paymentStatus = paymentStatus;
  await order.save();

  res.status(200).json({
    success: true,
    message: "Order updated successfully",
    data: order,
  });
});

exports.cancelOrder = catchAsync(async (req, res, next) => {
  const order = await Order.findOne({
    _id: req.params.id,
    user: req.user.id,
  });

  if (!order) return next(new AppError("Order not found", 404));
  if (order.status !== "Pending")
    return next(new AppError("Only pending orders can be cancelled", 400));

  for (const item of order.items) {
    const product = await Product.findById(item.product);
    if (product) {
      product.quantity += item.quantity;
      await product.save();
    }
  }

  order.status = "Cancelled";
  await order.save();

  res.status(200).json({
    success: true,
    message: "Order cancelled successfully",
    data: order,
  });
});
