// Create new order
const createOrder = (req, res) => {
    const { user_id, total_price } = req.body;
    const sql = `
        INSERT INTO orders (user_id, total_price, created_at)
        VALUES (?, ?, NOW())
    `;
    req.db.query(sql, [user_id, total_price], (err, result) => {
        if (err) {
            console.error('Error creating order:', err);
            return res.status(500).json({ error: 'Server error' });
        }
        res.status(201).json({ message: 'Order created successfully', id: result.insertId });
    });
};

// Soft delete an order
const softDeleteOrder = (req, res) => {
    const { id } = req.params;
    const sql = `
        UPDATE orders
        SET deleted = TRUE, deleted_at = NOW()
        WHERE id = ?
    `;
    req.db.query(sql, [id], (err, result) => {
        if (err) {
            console.error('Error soft deleting order:', err);
            return res.status(500).json({ error: 'Server error' });
        }
        res.status(200).json({ message: 'Order soft deleted successfully' });
    });
};

// Get all orders (not deleted)
const getAllOrders = (req, res) => {
    const sql = `SELECT * FROM orders WHERE deleted = FALSE`;
    req.db.query(sql, (err, results) => {
        if (err) {
            console.error('Error fetching orders:', err);
            return res.status(500).json({ error: 'Server error' });
        }
        res.status(200).json(results);
    });
};

// Get order by ID
const getOrderById = (req, res) => {
    const { id } = req.params;
    const sql = `
        SELECT * FROM orders
        WHERE id = ? AND deleted = FALSE
    `;
    req.db.query(sql, [id], (err, results) => {
        if (err) {
            console.error('Error fetching order by id:', err);
            return res.status(500).json({ error: 'Server error' });
        }
        if (results.length === 0) {
            return res.status(404).json({ message: 'Order not found' });
        }
        res.status(200).json(results[0]);
    });
};

const getOrdersByUserId = (req, res) => {
    const { user_id } = req.params;
    const sql = `
        SELECT * FROM orders
        WHERE user_id = ? AND deleted = FALSE
    `;
    req.db.query(sql, [user_id], (err, results) => {
        if (err) {
            console.error('Error fetching orders by user_id:', err);
            return res.status(500).json({ error: 'Server error' });
        }
        res.status(200).json(results);
    });
};

module.exports = {
    createOrder,
    softDeleteOrder,
    getAllOrders,
    getOrderById,
    getOrdersByUserId
};
