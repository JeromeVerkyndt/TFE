import { useState } from 'react';

function ProductsPage() {
    const [products, setProducts] = useState([
        { id: 1, name: "Pommes", quantity: "" },
        { id: 2, name: "Bananes", quantity: "" },
        { id: 3, name: "Carottes", quantity: "" },
    ]);

    const handleInputChange = (id, value) => {
        setProducts(products.map(product =>
            product.id === id ? { ...product, quantity: value } : product
        ));
    };

    const handleAdd = (product) => {
        alert(`Ajouté : ${product.name} (${product.quantity})`);
    };

    const handleDelete = (id) => {
        setProducts(products.filter(p => p.id !== id));
    };

    return (
        <div className="container-fluid">
            <h2>Liste des produits</h2>
            <ul className="list-group">
                {products.map(product => (
                    <li key={product.id} className="list-group-item d-flex justify-content-between align-items-center">
                        <span>{product.name}</span>
                        <input
                            type="number"
                            placeholder="Quantité"
                            className="form-control mx-2 w-25"
                            value={product.quantity}
                            onChange={(e) => handleInputChange(product.id, e.target.value)}
                        />
                        <button className="btn btn-success me-2" onClick={() => handleAdd(product)}>Ajouter</button>
                        <button className="btn btn-danger" onClick={() => handleDelete(product.id)}>Supprimer</button>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default ProductsPage;
