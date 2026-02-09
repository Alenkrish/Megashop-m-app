const express = require("express");
const router = express.Router();
const controller = require("../controllers/wishlistController");
const auth = require("../middleware/auth");

router.post("/", auth, controller.addToWishlist);
router.get("/", auth, controller.getWishlist);
router.delete("/:id", auth, controller.removeFromWishlist);
router.delete("/product/:productId", auth, controller.removeByProductId);

module.exports = router;