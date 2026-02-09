const express = require("express");
const router = express.Router();
const controller = require("../controllers/productController");

router.get("/categories", controller.getCategories);
router.get("/category/:category", controller.getProductsByCategory);
router.get("/", controller.getProducts);
router.get("/:id", controller.getProductById);

module.exports = router;