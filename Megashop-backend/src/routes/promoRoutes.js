const express = require("express");
const router = express.Router();
const controller = require("../controllers/promoController");
const auth = require("../middleware/auth");

router.post("/validate", auth, controller.validatePromoCode);

module.exports = router;
