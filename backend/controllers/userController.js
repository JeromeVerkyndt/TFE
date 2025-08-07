

const softDeleteUser = (req, res) => {
    const { id } = req.params;
    const sql = `
        UPDATE user
        SET deleted = true, deleted_at = NOW()
        WHERE id = ?
    `;
    req.db.query(sql, [id], (err, result) => {
        if (err) {
            console.error('Error deleting user:', err);
            return res.status(500).json({ error: 'Server error' });
        }
        res.status(200).json({ message: 'User deleted' });
    });
};

const getAllUsers = (req, res) => {
    const sql = `
        SELECT *
        FROM user
        WHERE deleted = false
    `;
    req.db.query(sql, (err, results) => {
        if (err) {
            console.error('Error fetching users:', err);
            return res.status(500).json({ error: 'Server error' });
        }
        res.status(200).json(results);
    });
};

const getAllClients = (req, res) => {
    const sql = `
        SELECT user.*
        FROM user
        JOIN user_status ON user.status_id = user_status.id
        WHERE user_status.name = 'CLIENT' AND user.deleted = false
    `;
    req.db.query(sql, (err, results) => {
        if (err) {
            console.error('Error fetching client users:', err);
            return res.status(500).json({ error: 'Server error' });
        }
        res.status(200).json(results);
    });
};



const getUserById = (req, res) => {
    const { id } = req.params;
    const sql = `
        SELECT id, last_name, email, created_at
        FROM user
        WHERE id = ? AND deleted = false
    `;
    req.db.query(sql, [id], (err, results) => {
        if (err) {
            console.error('Error fetching user:', err);
            return res.status(500).json({ error: 'Server error' });
        }
        if (results.length === 0) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.status(200).json(results[0]);
    });
};

const updateUserById = (req, res) => {
    const { id } = req.params;
    const { balance, extra_balance } = req.body;

    const sql = `UPDATE user SET balance = ?, extra_balance = ? WHERE id = ?`;

    req.db.query(sql, [balance, extra_balance, id], (err) => {
        if (err) {
            console.error('Erreur lors de la mise à jour du user :', err);
            res.status(500).json({ error: 'Erreur serveur' });
        } else {
            res.status(200).json({ message: 'user mis à jour' });
        }
    });
};

const subtractFromUserBalance = (req, res) => {
    const { id } = req.params;
    const { amount } = req.body;

    if (typeof amount !== 'number' || isNaN(amount) || amount < 0) {
        return res.status(400).json({ error: 'Montant invalide' });
    }

    const getUserSql = `SELECT balance FROM user WHERE id = ? AND deleted = false`;
    req.db.query(getUserSql, [id], (err, results) => {
        if (err) {
            console.error('Erreur lors de la récupération du solde :', err);
            return res.status(500).json({ error: 'Erreur serveur' });
        }

        if (results.length === 0) {
            return res.status(404).json({ error: 'Utilisateur non trouvé' });
        }

        const currentBalance = parseFloat(results[0].balance);
        const newBalance = currentBalance - amount;

        const updateSql = `UPDATE user SET balance = ? WHERE id = ?`;
        req.db.query(updateSql, [newBalance, id], (updateErr) => {
            if (updateErr) {
                console.error('Erreur lors de la mise à jour du solde :', updateErr);
                return res.status(500).json({ error: 'Erreur serveur' });
            }

            res.status(200).json({ message: 'Solde mis à jour', newBalance });
        });
    });
};

const subtractFromUserExtraBalance = (req, res) => {
    const { id } = req.params;
    const { amount } = req.body;

    if (typeof amount !== 'number' || isNaN(amount) || amount < 0) {
        return res.status(400).json({ error: 'Montant invalide' });
    }

    const getUserSql = `SELECT extra_balance FROM user WHERE id = ? AND deleted = false`;
    req.db.query(getUserSql, [id], (err, results) => {
        if (err) {
            console.error('Erreur lors de la récupération du solde :', err);
            return res.status(500).json({ error: 'Erreur serveur' });
        }

        if (results.length === 0) {
            return res.status(404).json({ error: 'Utilisateur non trouvé' });
        }

        const currentBalance = parseFloat(results[0].extra_balance);
        const newBalance = currentBalance - amount;

        const updateSql = `UPDATE user SET extra_balance = ? WHERE id = ?`;
        req.db.query(updateSql, [newBalance, id], (updateErr) => {
            if (updateErr) {
                console.error('Erreur lors de la mise à jour du solde :', updateErr);
                return res.status(500).json({ error: 'Erreur serveur' });
            }

            res.status(200).json({ message: 'Solde mis à jour', newBalance });
        });
    });
};

const updateUserBalance = (req, res) => {
    const { id } = req.params;
    const { amount } = req.body;

    if (typeof amount !== 'number' || isNaN(amount)) {
        return res.status(400).json({ error: 'Montant invalide' });
    }

    const getUserSql = `SELECT balance FROM user WHERE id = ? AND deleted = false`;
    req.db.query(getUserSql, [id], (err, results) => {
        if (err) {
            console.error('Erreur lors de la récupération du solde :', err);
            return res.status(500).json({ error: 'Erreur serveur' });
        }

        if (results.length === 0) {
            return res.status(404).json({ error: 'Utilisateur non trouvé' });
        }

        const currentBalance = parseFloat(results[0].balance);
        const newBalance = currentBalance + amount;

        const updateSql = `UPDATE user SET balance = ? WHERE id = ?`;
        req.db.query(updateSql, [newBalance, id], (updateErr) => {
            if (updateErr) {
                console.error('Erreur lors de la mise à jour du solde :', updateErr);
                return res.status(500).json({ error: 'Erreur serveur' });
            }

            res.status(200).json({ message: 'Solde mis à jour', newBalance });
        });
    });
};

const updateUserExtraBalance = (req, res) => {
    const { id } = req.params;
    const { amount } = req.body;

    if (typeof amount !== 'number' || isNaN(amount)) {
        return res.status(400).json({ error: 'Montant invalide' });
    }

    const getUserSql = `SELECT extra_balance FROM user WHERE id = ? AND deleted = false`;
    req.db.query(getUserSql, [id], (err, results) => {
        if (err) {
            console.error('Erreur lors de la récupération du solde extra :', err);
            return res.status(500).json({ error: 'Erreur serveur' });
        }

        if (results.length === 0) {
            return res.status(404).json({ error: 'Utilisateur non trouvé' });
        }

        const currentBalance = parseFloat(results[0].extra_balance);
        const newBalance = currentBalance + amount;

        const updateSql = `UPDATE user SET extra_balance = ? WHERE id = ?`;
        req.db.query(updateSql, [newBalance, id], (updateErr) => {
            if (updateErr) {
                console.error('Erreur lors de la mise à jour du solde extra :', updateErr);
                return res.status(500).json({ error: 'Erreur serveur' });
            }

            res.status(200).json({ message: 'Solde extra mis à jour', newBalance });
        });
    });
};

const updateUserSubscription = (req, res) => {
    const id = req.params.id;
    const { subscriptionId } = req.body;

    const sql = `UPDATE user SET subscription_id = ? WHERE id = ?`;

    req.db.query(sql, [subscriptionId, id], (err, result) => {
        if (err) {
            console.error("Erreur lors de la mise à jour de l'abonnement utilisateur :", err);
            return res.status(500).json({ error: "Erreur serveur" });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: "Utilisateur non trouvé" });
        }

        return res.status(200).json({ message: "Abonnement mis à jour" });
    });
};


module.exports = {
    softDeleteUser,
    getAllUsers,
    getUserById,
    updateUserById,
    getAllClients,
    subtractFromUserBalance,
    subtractFromUserExtraBalance,
    updateUserExtraBalance,
    updateUserBalance,
    updateUserSubscription
};

