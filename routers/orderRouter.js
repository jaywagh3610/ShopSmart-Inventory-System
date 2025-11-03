const express = require("express");
const router = express.Router();
const orderController = require("../controllers/orderControlller");
const { adminOnly, verifyToken } = require("../Middleware/verifyToken");

router.post("/", verifyToken, orderController.placeOrder);
router.get("/my-orders", verifyToken, orderController.getUserOrders);
router.patch("/cancel/:id", verifyToken, orderController.cancelOrder);

router.get("/", verifyToken, adminOnly, orderController.getAllOrders);
router.patch("/:id", verifyToken, adminOnly, orderController.updateOrderStatus);

module.exports = router;
