const pool = require("../utils/db");

// VALIDATE PROMO CODE
exports.validatePromoCode = async (req, res) => {
    const { code } = req.body;

    try {
        const result = await pool.query(
            `SELECT * FROM promo_codes 
       WHERE code = $1 AND is_active = true 
       AND (valid_until IS NULL OR valid_until > NOW())`,
            [code.toUpperCase()]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ message: "Invalid or expired promo code" });
        }

        const promoCode = result.rows[0];

        res.json({
            code: promoCode.code,
            discount_percent: promoCode.discount_percent,
            description: promoCode.description,
        });
    } catch (err) {
        console.error("Promo code validation error:", err);
        res.status(500).json({ message: "Failed to validate promo code" });
    }
};
