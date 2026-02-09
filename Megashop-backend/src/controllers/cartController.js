const pool = require("../utils/db");

// ADD TO CART
// ADD TO CART
exports.addToCart = async (req, res) => {
  const { product_id, quantity } = req.body;
  const qty = quantity || 1;

  try {
    // Check if item already exists
    const existing = await pool.query(
      "SELECT * FROM cart_items WHERE user_id = $1 AND product_id = $2",
      [req.user.id, product_id]
    );

    if (existing.rows.length > 0) {
      // Update quantity
      const result = await pool.query(
        `UPDATE cart_items 
         SET quantity = quantity + $1 
         WHERE id = $2 
         RETURNING *`,
        [qty, existing.rows[0].id]
      );
      return res.status(200).json(result.rows[0]);
    }

    // Insert new item
    const result = await pool.query(
      `INSERT INTO cart_items (user_id, product_id, quantity)
       VALUES ($1, $2, $3)
       RETURNING *`,
      [req.user.id, product_id, qty]
    );

    console.log("Item added to cart:", result.rows[0]);
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error("Add to cart error:", err);
    res.status(500).json({ message: "Failed to add item to cart", error: err.message });
  }
};

// GET USER CART
exports.getCart = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT c.id, c.product_id, p.name AS product_name, p.price, p.images, c.quantity
       FROM cart_items c
       JOIN products p ON c.product_id = p.id
       WHERE c.user_id = $1`,
      [req.user.id]
    );

    res.json(result.rows);
  } catch (err) {
    console.error("Cart fetch error:", err);
    res.status(500).json({ message: "Failed to fetch cart" });
  }
};

// UPDATE CART ITEM QUANTITY
exports.updateCartItem = async (req, res) => {
  const { quantity } = req.body;

  try {
    const result = await pool.query(
      `UPDATE cart_items
       SET quantity = $1
       WHERE id = $2 AND user_id = $3
       RETURNING *`,
      [quantity, req.params.id, req.user.id]
    );

    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ message: "Failed to update cart item" });
  }
};

// REMOVE ITEM FROM CART
exports.removeCartItem = async (req, res) => {
  try {
    await pool.query(
      `DELETE FROM cart_items
       WHERE id = $1 AND user_id = $2`,
      [req.params.id, req.user.id]
    );

    res.json({ message: "Item removed from cart" });
  } catch (err) {
    res.status(500).json({ message: "Failed to remove cart item" });
  }
};

// UPDATE CART QUANTITY BY PRODUCT ID
exports.updateCartQuantity = async (req, res) => {
  const { quantity } = req.body;

  try {
    const result = await pool.query(
      `UPDATE cart_items
       SET quantity = $1
       WHERE product_id = $2 AND user_id = $3
       RETURNING *`,
      [quantity, req.params.productId, req.user.id]
    );

    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ message: "Failed to update cart quantity" });
  }
};

// REMOVE ITEM BY PRODUCT ID
exports.removeByProductId = async (req, res) => {
  try {
    await pool.query(
      `DELETE FROM cart_items
       WHERE product_id = $1 AND user_id = $2`,
      [req.params.productId, req.user.id]
    );

    res.json({ message: "Item removed from cart" });
  } catch (err) {
    res.status(500).json({ message: "Failed to remove cart item" });
  }
};