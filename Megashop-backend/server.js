const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "MegaShop API is running" });
});

const PORT = process.env.PORT || 5000;

const authRoutes = require("./src/routes/authRoutes");
app.use("/api/auth", authRoutes);

const productRoutes = require("./src/routes/productRoutes");
app.use("/api/products", productRoutes);

const cartRoutes = require("./src/routes/cartRoutes");
app.use("/api/cart", cartRoutes);

const orderRoutes = require("./src/routes/orderRoutes");
app.use("/api/orders", orderRoutes);

const wishlistRoutes = require("./src/routes/wishlistRoutes");
app.use("/api/wishlist", wishlistRoutes);

const promoRoutes = require("./src/routes/promoRoutes");
app.use("/api/promo", promoRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
