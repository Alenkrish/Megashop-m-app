const pool = require("../utils/db");

// CREATE ORDER (CHECKOUT)
exports.createOrder = async (req, res) => {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const { payment_method, shipping_address, promo_code } = req.body;

    // Get cart items
    const cartRes = await client.query(
      `SELECT c.product_id, c.quantity, p.price
       FROM cart_items c
       JOIN products p ON c.product_id = p.id
       WHERE c.user_id = $1`,
      [req.user.id]
    );

    if (cartRes.rows.length === 0) {
      await client.query("ROLLBACK");
      return res.status(400).json({ message: "Cart is empty" });
    }

    // Calculate totals
    let subtotal = 0;
    cartRes.rows.forEach(i => {
      subtotal += Number(i.price) * i.quantity;
    });

    const tax = subtotal * 0.1;
    const shipping = subtotal > 5000 ? 0 : 100; // Free shipping over Rs.5000
    let discount = 0;

    // Apply promo code if provided
    if (promo_code) {
      const promoRes = await client.query(
        "SELECT discount_percent FROM promo_codes WHERE code = $1 AND active = true",
        [promo_code]
      );
      if (promoRes.rows.length > 0) {
        discount = subtotal * (promoRes.rows[0].discount_percent / 100);
      }
    }

    const total = subtotal + tax + shipping - discount;

    // Generate transaction ID
    const transaction_id = `TXN_${Date.now()}_${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

    // Payment status: COD is pending, others are completed
    const payment_status = payment_method === 'cod' ? 'pending' : 'completed';

    // Create order
    const orderRes = await client.query(
      `INSERT INTO orders
       (user_id, order_number, subtotal, tax, shipping, discount, total, status, 
        payment_method, payment_status, transaction_id, shipping_address)
       VALUES ($1, $2, $3, $4, $5, $6, $7, 'confirmed', $8, $9, $10, $11)
       RETURNING *`,
      [
        req.user.id,
        "ORD-" + Date.now(),
        subtotal,
        tax,
        shipping,
        discount,
        total,
        payment_method,
        payment_status,
        transaction_id,
        JSON.stringify(shipping_address),
      ]
    );

    const orderId = orderRes.rows[0].id;

    // Insert order items
    for (const item of cartRes.rows) {
      await client.query(
        `INSERT INTO order_items (order_id, product_id, quantity, price)
         VALUES ($1, $2, $3, $4)`,
        [orderId, item.product_id, item.quantity, item.price]
      );
    }

    // Clear cart
    await client.query(
      "DELETE FROM cart_items WHERE user_id = $1",
      [req.user.id]
    );

    await client.query("COMMIT");
    res.status(201).json(orderRes.rows[0]);
  } catch (err) {
    await client.query("ROLLBACK");
    console.error("Checkout error:", err);
    res.status(500).json({ message: "Checkout failed" });
  } finally {
    client.release();
  }
};

// GET USER ORDERS
exports.getOrders = async (req, res) => {
  try {
    // Get orders
    const ordersResult = await pool.query(
      "SELECT * FROM orders WHERE user_id = $1 ORDER BY created_at DESC",
      [req.user.id]
    );

    // Get order items for each order
    const ordersWithItems = await Promise.all(
      ordersResult.rows.map(async (order) => {
        const itemsResult = await pool.query(
          `SELECT oi.*, p.name as product_name
           FROM order_items oi
           JOIN products p ON oi.product_id = p.id
           WHERE oi.order_id = $1`,
          [order.id]
        );
        return {
          ...order,
          items: itemsResult.rows,
        };
      })
    );

    res.json(ordersWithItems);
  } catch (err) {
    console.error("Error fetching orders:", err);
    res.status(500).json({ message: "Failed to fetch orders" });
  }
};