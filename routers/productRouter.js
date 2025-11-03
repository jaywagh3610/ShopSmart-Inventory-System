const express = require("express");
const productController = require("../controllers/productController");
const { verifyToken, adminOnly } = require("../Middleware/verifyToken");

const router = express.Router();
router.route("/").get(productController.getProducts);
router.post("/create", verifyToken, adminOnly, productController.createProduct);

router
  .route("/:id")
  .get(verifyToken, adminOnly, productController.getProduct)
  .patch(verifyToken, adminOnly, productController.updateProduct)
  .delete(verifyToken, adminOnly, productController.deleteProduct);

module.exports = router;
