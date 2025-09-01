

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

const getAllClientsInformation = (req, res) => {
    const sql = `
        SELECT
            user.*,
            subscription.price AS subscription_price, subscription.name AS subscription_name
        FROM user
        JOIN user_statu ON user.status_id = user_statu.id
        LEFT JOIN subscription ON user.subscription_id = subscription.id
        WHERE user_statu.name = 'CLIENT'
          AND user.deleted = false
    `;
    req.db.query(sql, (err, results) => {
        if (err) {
            console.error('Error fetching client users:', err);
            return res.status(500).json({ error: 'Server error' });
        }
        res.status(200).json(results);
    });
};

const getAllClients = (req, res) => {
    const sql = `
        SELECT user.*
        FROM user
        JOIN user_statu ON user.status_id = user_statu.id
        WHERE user_statu.name = 'CLIENT' AND user.deleted = false
        ORDER BY user.last_name ASC;
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

const updateEmail = (req, res) => {
    const { id } = req.params;
    const { email } = req.body;

    if (!email) {
        return res.status(400).json({ error: "L'email est requis." });
    }

    const sql = "UPDATE user SET email = ? WHERE id = ?";
    req.db.query(sql, [email, id], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: "Erreur lors de la mise à jour de l'email." });
        }
        res.json({ message: "Email mis à jour avec succès !" });
    });
};

const resetUserBalanceToSubscription = (req, res) => {
    const { id } = req.params;

    const sql = `
        UPDATE user
            LEFT JOIN subscription ON user.subscription_id = subscription.id
            SET user.balance = COALESCE(subscription.price, 0)
        WHERE user.id = ? AND user.deleted = false
    `;

    req.db.query(sql, [id], (err, result) => {
        if (err) {
            console.error('Erreur lors de la remise à zéro du solde :', err);
            return res.status(500).json({ error: 'Erreur serveur' });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Utilisateur non trouvé' });
        }

        res.status(200).json({ message: 'Balance remise au montant de l’abonnement ou à 0' });
    });
};


async function resetAllClientBalancesToSubscription(req, res) {
    const db = req.db.promise();
    const conn = await db.getConnection();

    try {
        await conn.beginTransaction();

        await conn.query(`DROP TEMPORARY TABLE IF EXISTS tmp_target_user_ids`);
        await conn.query(`
      CREATE TEMPORARY TABLE tmp_target_user_ids (
        user_id BIGINT UNSIGNED PRIMARY KEY,
        amount  DECIMAL(10,2) NOT NULL
      ) ENGINE=Memory
    `);

        const insertTargetsSql = `
      INSERT INTO tmp_target_user_ids (user_id, amount)
      SELECT u.id, COALESCE(s.price, 0) AS amount
      FROM user u
      LEFT JOIN subscription s ON u.subscription_id = s.id
      JOIN user_statu us ON u.status_id = us.id
      WHERE us.name = 'CLIENT' AND u.deleted = FALSE
    `;
        await conn.query(insertTargetsSql);

        const updateSql = `
      UPDATE user u
      JOIN tmp_target_user_ids t ON t.user_id = u.id
      SET u.balance = t.amount
    `;
        const [updateRes] = await conn.query(updateSql);

        await conn.commit();

        const [rows] = await conn.query(`SELECT user_id, amount FROM tmp_target_user_ids`);

        await conn.query(`DROP TEMPORARY TABLE IF EXISTS tmp_target_user_ids`);

        return res.status(200).json({
            message: 'Balances mises à jour. IDs et montants renvoyés pour créer les transactions.',
            affectedUsers: updateRes.affectedRows,
            users: rows
        });
    } catch (err) {
        await conn.rollback();
        console.error('Erreur reset balances :', err);
        return res.status(500).json({ error: 'Erreur serveur' });
    } finally {
        conn.release();
    }
}

module.exports = { resetAllClientBalancesToSubscription };




module.exports = {
    softDeleteUser,
    getAllUsers,
    getUserById,
    updateUserById,
    getAllClients,
    getAllClientsInformation,
    subtractFromUserBalance,
    subtractFromUserExtraBalance,
    updateUserExtraBalance,
    updateUserBalance,
    updateUserSubscription,
    updateEmail,
    resetUserBalanceToSubscription,
    resetAllClientBalancesToSubscription
};

