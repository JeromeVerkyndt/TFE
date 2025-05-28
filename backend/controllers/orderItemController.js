const createOrderItem = (req, res) => {
    const { order_id, product_id, quantity, promo } = req.body;
    const sql = `
        INSERT INTO order_items (order_id, product_id, quantity, promo, created_at)
        VALUES (?, ?, ?, ?, NOW())
    `;
    req.db.query(sql, [order_id, product_id, quantity, promo], (err, result) => {
        if (err) {
            console.error('Error creating order_item:', err);
            return res.status(500).json({ error: 'Server error' });
        }
        res.status(201).json({ message: 'Order item created successfully', id: result.insertId });
    });
};

const softDeleteOrderItem = (req, res) => {
    const { id } = req.params;
    const sql = `
        UPDATE order_items
        SET deleted = TRUE, deleted_at = NOW()
        WHERE id = ?
    `;
    req.db.query(sql, [id], (err, result) => {
        if (err) {
            console.error('Error soft deleting order_item:', err);
            return res.status(500).json({ error: 'Server error' });
        }
        res.status(200).json({ message: 'Order item soft deleted successfully' });
    });
};

const getAllOrderItems = (req, res) => {
    const sql = `SELECT * FROM order_items WHERE deleted = FALSE`;
    req.db.query(sql, (err, results) => {
        if (err) {
            console.error('Error fetching order_items:', err);
            return res.status(500).json({ error: 'Server error' });
        }
        res.status(200).json(results);
    });
};

const getOrderItemsByOrderId = (req, res) => {
    const { order_id } = req.params;
    const sql = `
        SELECT * FROM order_items
        WHERE order_id = ? AND deleted = FALSE
    `;
    req.db.query(sql, [order_id], (err, results) => {
        if (err) {
            console.error('Error fetching order_items by order_id:', err);
            return res.status(500).json({ error: 'Server error' });
        }
        res.status(200).json(results);
    });
};

module.exports = {
    createOrderItem,
    softDeleteOrderItem,
    getAllOrderItems,
    getOrderItemsByOrderId,
};
