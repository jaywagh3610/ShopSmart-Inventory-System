const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
const UserModel = require("../Models/userModel");
const generateToken = require("../utils/generateToken");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");

exports.registerUser = catchAsync(async (req, res, next) => {
  const { name, email, password, role } = req.body;

  if (!name || !email || !password) {
    return next(
      new AppError("All fields (name, email, password) are required", 400)
    );
  }

  const existingUser = await UserModel.findOne({ email });
  if (existingUser) {
    return next(new AppError("User already exists", 400));
  }

  if (role === "admin" && (!req.user || req.user.role !== "admin")) {
    return next(new AppError("Only admins can create other admins", 403));
  }

  const newUser = await UserModel.create({
    name,
    email,
    password,
    role: role || "user",
  });

  const token = generateToken(newUser);

  res.status(201).json({
    success: true,
    message: "User registered successfully",
    user: {
      id: newUser._id,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
    },
    token,
  });
});

exports.getUser = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new AppError("Email and password are required", 400));
  }

  const user = await UserModel.findOne({ email });
  if (!user) return next(new AppError("User not found", 404));

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return next(new AppError("Invalid password", 401));

  const token = generateToken(user);

  res.status(200).json({
    success: true,
    message: "Login successful",
    data: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
    token,
  });
});

exports.createAdmin = catchAsync(async (req, res, next) => {
  const { name, email, password } = req.body;

  if (!req.user || req.user.role !== "admin") {
    return next(new AppError("Only admins can create another admin", 403));
  }

  if (!name || !email || !password) {
    return next(
      new AppError("All fields (name, email, password) are required", 400)
    );
  }

  const existingUser = await UserModel.findOne({ email });
  if (existingUser) {
    return next(new AppError("User already exists", 400));
  }

  const newAdmin = await UserModel.create({
    name,
    email,
    password,
    role: "admin",
  });

  const token = generateToken(newAdmin);

  res.status(201).json({
    success: true,
    message: "Admin created successfully",
    admin: {
      id: newAdmin._id,
      name: newAdmin.name,
      email: newAdmin.email,
      role: newAdmin.role,
    },
    token,
  });
});
