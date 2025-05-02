const addProduct = (req, res) => {
    const {
        name,
        description,
        unit,
        price,
        included_in_subscription,
        image_url,
        promo
    } = req.body;

    const sql = `
    INSERT INTO products (name, description, unit, price, included_in_subscription, image_url, promo)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `;

    req.db.query(
        sql,
        [name, description, unit, price, included_in_subscription, image_url, promo],
        (err, result) => {
            if (err) {
                console.error('Erreur MySQL:', err);
                res.status(500).json({ error: 'Erreur lors de l\'ajout du produit' });
            } else {
                res.status(201).json({ message: 'Produit ajouté', productId: result.insertId });
            }
        }
    );
};

const getAllProducts = (req, res) => {
    const sql = `SELECT * FROM products`;

    req.db.query(sql, (err, results) => {
        if (err) {
            console.error('Erreur lors de la récupération des produits :', err);
            res.status(500).json({ error: 'Erreur serveur' });
        } else {
            res.status(200).json(results);
        }
    });
};

module.exports = {
    addProduct,
    getAllProducts
};

