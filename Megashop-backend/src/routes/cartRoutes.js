const express = require("express");
const router = express.Router();
const controller = require("../controllers/cartController");
const auth = require("../middleware/auth");

router.post("/", auth, controller.addToCart);
router.get("/", auth, controller.getCart);
router.put("/:id", auth, controller.updateCartItem);
router.patch("/:productId", auth, controller.updateCartQuantity);
router.delete("/:id", auth, controller.removeCartItem);
router.delete("/product/:productId", auth, controller.removeByProductId);

module.exports = router;