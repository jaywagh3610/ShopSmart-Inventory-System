const Product = require("../Models/productModel");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");

exports.createProduct = catchAsync(async (req, res, next) => {
  const { name, modelName, company, category, quantity = 0, price } = req.body;

  if (!name || !modelName || !company || !category || price == null) {
    return next(new AppError("Missing required fields", 400));
  }

  const existingProduct = await Product.findOne({ name, modelName, company });

  if (existingProduct) {
    existingProduct.quantity += quantity;
    await existingProduct.save();

    return res.status(200).json({
      success: true,
      message: "Existing product quantity updated successfully",
      data: existingProduct,
    });
  }

  const newProduct = await Product.create({
    name,
    modelName,
    company,
    category,
    quantity,
    price,
  });

  res.status(201).json({
    success: true,
    message: "Product created successfully",
    data: newProduct,
  });
});

exports.getProducts = catchAsync(async (req, res, next) => {
  const {
    category,
    minPrice,
    maxPrice,
    sortBy = "createdAt",
    sortDir = "desc",
    q,
    page = 1,
    limit = 10,
  } = req.query;

  const filter = {};
  if (category) filter.category = category;
  if (q) filter.name = { $regex: q, $options: "i" };
  if (minPrice || maxPrice) {
    filter.price = {};
    if (minPrice) filter.price.$gte = Number(minPrice);
    if (maxPrice) filter.price.$lte = Number(maxPrice);
  }
  console.log(filter);
  const skip = (Math.max(1, Number(page)) - 1) * Number(limit);
  const sort = { [sortBy]: sortDir === "desc" ? -1 : 1 };

  const [items, total] = await Promise.all([
    Product.find(filter).sort(sort).skip(skip).limit(Number(limit)),
    Product.countDocuments(filter),
  ]);

  res.status(200).json({
    success: true,
    total,
    page: Number(page),
    limit: Number(limit),
    data: items,
  });
});

exports.getProduct = catchAsync(async (req, res, next) => {
  const product = await Product.findById(req.params.id);
  if (!product) return next(new AppError("Product not found", 404));

  res.status(200).json({ success: true, data: product });
});

exports.updateProduct = catchAsync(async (req, res, next) => {
  const updates = req.body;
  const product = await Product.findByIdAndUpdate(req.params.id, updates, {
    new: true,
    runValidators: true,
  });

  if (!product) return next(new AppError("Product not found", 404));

  res.status(200).json({
    success: true,
    message: "Product updated successfully",
    data: product,
  });
});

exports.deleteProduct = catchAsync(async (req, res, next) => {
  const product = await Product.findByIdAndDelete(req.params.id);
  if (!product) return next(new AppError("Product not found", 404));

  res.status(200).json({
    success: true,
    message: "Product deleted successfully",
  });
});
``