const express = require("express");
const router = express.Router();
const controller = require("../controllers/orderController");
const auth = require("../middleware/auth");

router.post("/", auth, controller.createOrder);
router.get("/", auth, controller.getOrders);

module.exports = router;
