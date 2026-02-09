const pool = require("../utils/db");

// ADD TO WISHLIST
exports.addToWishlist = async (req, res) => {
  const { product_id } = req.body;

  try {
    const result = await pool.query(
      `INSERT INTO wishlist (user_id, product_id)
       VALUES ($1, $2)
       ON CONFLICT DO NOTHING
       RETURNING *`,
      [req.user.id, product_id]
    );

    console.log("Added to wishlist:", result.rows[0]);
    res.status(201).json({ message: "Added to wishlist" });
  } catch (err) {
    console.error("Add to wishlist error:", err);
    res.status(500).json({ message: "Failed to add to wishlist", error: err.message });
  }
};

// GET WISHLIST
exports.getWishlist = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT w.id, w.product_id, p.name AS product_name, p.price, p.images, p.category
       FROM wishlist w
       JOIN products p ON w.product_id = p.id
       WHERE w.user_id = $1`,
      [req.user.id]
    );

    res.json(result.rows);
  } catch (err) {
    console.error("Wishlist fetch error:", err);
    res.status(500).json({ message: "Failed to fetch wishlist" });
  }
};

// REMOVE FROM WISHLIST
exports.removeFromWishlist = async (req, res) => {
  try {
    await pool.query(
      `DELETE FROM wishlist
       WHERE id = $1 AND user_id = $2`,
      [req.params.id, req.user.id]
    );

    res.json({ message: "Removed from wishlist" });
  } catch (err) {
    res.status(500).json({ message: "Failed to remove item" });
  }
};

// REMOVE BY PRODUCT ID
exports.removeByProductId = async (req, res) => {
  try {
    await pool.query(
      `DELETE FROM wishlist
       WHERE product_id = $1 AND user_id = $2`,
      [req.params.productId, req.user.id]
    );

    res.json({ message: "Removed from wishlist" });
  } catch (err) {
    console.error("Wishlist remove error:", err);
    res.status(500).json({ message: "Failed to remove item" });
  }
};