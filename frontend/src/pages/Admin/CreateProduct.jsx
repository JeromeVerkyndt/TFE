import React, { useState } from "react";
import axios from "axios";

function CreateProduct() {
    const [formData, setFormData] = useState({
        name: "",
        description: "",
        unit: "",
        price: "",
        includedInSubscription: false,
        promo: false,
    });

    const handleChange = (e) => {
        const { name, value, type, checked, files } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : type === "file" ? files[0] : value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {

            const imageData = new FormData();
            imageData.append("image", formData.image);

            const uploadRes = await axios.post("http://localhost:5001/api/upload", imageData); // port 3001 pour Cloudinary
            const imageUrl = uploadRes.data.imageUrl;

            const response = await axios.post("http://localhost:5001/api/products", {
                name: formData.name,
                description: formData.description,
                unit: formData.unit,
                price: parseFloat(formData.price),
                included_in_subscription: formData.includedInSubscription,
                promo: null, // ou une valeur par défaut
                image_url: imageUrl,
            });

            console.log(response.data);
            alert("Produit créé !");
        } catch (error) {
            console.error("Erreur Axios:", error);
            alert("Erreur lors de la création du produit");
        }
        // Ici tu pourrais envoyer formData à ton backend avec fetch ou axios
    };

    return (
        <div className="container mt-4">
            <h2 className="mb-4">Créer un produit</h2>
            <form onSubmit={handleSubmit} className="p-4 border rounded bg-light">

                <div className="mb-3">
                    <label className="form-label">Image du produit</label>
                    <input
                        type="file"
                        name="image"
                        accept="image/*"
                        className="form-control"
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="mb-3">
                    <label className="form-label">Nom du produit</label>
                    <input
                        type="text"
                        name="name"
                        className="form-control"
                        value={formData.name}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="mb-3">
                    <label className="form-label">Description</label>
                    <textarea
                        type="text"
                        name="description"
                        className="form-control"
                        value={formData.description}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="mb-3">
                    <label className="form-label">Unité</label>
                    <input
                        type="text"
                        name="unit"
                        className="form-control"
                        value={formData.unit}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="mb-3">
                    <label className="form-label">Prix (€)</label>
                    <input
                        type="number"
                        name="price"
                        className="form-control"
                        value={formData.price}
                        onChange={handleChange}
                        required
                        min="0"
                        step="0.01"
                    />
                </div>

                <div className="form-check mb-3">
                    <input
                        type="checkbox"
                        className="form-check-input"
                        name="includedInSubscription"
                        checked={formData.includedInSubscription}
                        onChange={handleChange}
                    />
                    <label className="form-check-label">
                        Inclure dans l'abonnement
                    </label>
                </div>

                <button type="submit" className="btn btn-primary">Créer le produit</button>
            </form>
        </div>
    );
}

export default CreateProduct;
