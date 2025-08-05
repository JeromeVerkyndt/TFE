import React, {useEffect, useState} from "react";
import axios from "axios";
import api from '../../api.js';
import Button from "react-bootstrap/Button";
import Table from "react-bootstrap/Table";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import ToggleButton from "react-bootstrap/ToggleButton";
import {Checkbox} from "@mui/material";


function CreateProduct() {
    const [productList, setProductList] = useState([]);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const [show, setShow] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        description: "",
        unit: "",
        price: "",
        includedInSubscription: false,
        promo: false,
    });

    const handleSoftDelete = (id) => {
        if (!window.confirm("Es-tu sûr de vouloir supprimer cet élément ?")) return;

        api.delete(`/products/${id}`)
            .then(() => {
                setProductList(prev => prev.filter(item => item.id !== id));
            })
            .catch(error => {
                console.error("Erreur lors de la suppression du produit:", error);
            });
    };

    const handleUpdate = (id, description, price, name, included_in_subscription) => {
        api.put(`/products/update/${id}`, {
            name,
            description,
            price,
            included_in_subscription
        })
            .then(() => {
                alert("Produit mis à jour !");
            })
            .catch((error) => {
                console.error("Erreur lors de la mise à jour du produit:", error);
            });
    };

    useEffect(() => {
        api.get('/products/')
            .then(response => {
                console.log(response.data)
                setProductList(response.data);
            })
            .catch(error => {
                console.error('Erreur lors de la récupération du stock :', error);
            });
    }, []);

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

            const uploadRes = await api.post("/upload", imageData);
            const imageUrl = uploadRes.data.imageUrl;

            const response = await api.post("/products", {
                name: formData.name,
                description: formData.description,
                unit: formData.unit,
                price: parseFloat(formData.price),
                included_in_subscription: formData.includedInSubscription,
                promo: null,
                image_url: imageUrl,
            });

            console.log(response.data);
            alert("Produit créé !");
            window.location.reload();
        } catch (error) {
            console.error("Erreur Axios:", error);
            alert("Erreur lors de la création du produit");
        }
    };

    return (
        <>
            <div className="d-flex justify-content-end mb-3">
                <Button variant="success" onClick={handleShow}>
                    + Produit
                </Button>
            </div>

            <div>
                <Table striped bordered hover>
                    <thead>
                    <tr>
                        <th></th>
                        <th>Nom</th>
                        <th>Description</th>
                        <th>Prix</th>
                        <th>Abonnement</th>
                        <th></th>
                    </tr>
                    </thead>
                    <tbody>
                    {productList.map((item, index) => (
                        <tr key={item.id}>
                            <td>
                                <div className="d-flex align-items-center gap-2">
                                    {item.image_url && (
                                        <img
                                            src={item.image_url}
                                            alt={item.name}
                                            style={{ width: "50px", height: "50px", objectFit: "cover", borderRadius: "8px" }}
                                        />
                                    )}
                                </div>
                            </td>
                            <td>
                                <div className="d-flex align-items-center">
                                    <input
                                        type="texte"
                                        className="form-control bg-white text-dark w-auto"
                                        value={item.name}
                                        onChange={(e) => {
                                            const newProductList = [...productList];
                                            newProductList[index].name = e.target.value;
                                            setProductList(newProductList);
                                        }}
                                    />
                                </div>
                            </td>
                            <td>
                                <div className="d-flex align-items-center">
                                    <textarea
                                        type="textearea"
                                        className="form-control bg-white text-dark w-100"
                                        value={item.description}
                                        onChange={(e) => {
                                            const newProductList = [...productList];
                                            newProductList[index].description = e.target.value;
                                            setProductList(newProductList);
                                        }}
                                    />
                                </div>
                            </td>
                            <td>
                                <div className="d-flex align-items-center">
                                    <input
                                        type="number"
                                        className="form-control bg-white text-dark w-auto"
                                        value={item.price}
                                        onChange={(e) => {
                                            const newProductList = [...productList];
                                            newProductList[index].price = e.target.value;
                                            setProductList(newProductList);
                                        }}
                                    />
                                    €/{item.unit}
                                </div>
                            </td>
                            <td>
                                <div className="form-check d-flex justify-content-center">
                                    <input
                                        className="form-check-input"
                                        type="checkbox"
                                        checked={item.included_in_subscription}
                                        onChange={(e) => {
                                            const newProductList = [...productList];
                                            newProductList[index].included_in_subscription = e.target.checked;
                                            setProductList(newProductList);
                                        }}
                                    />
                                </div>
                            </td>
                            <td>
                                <Button variant="primary" onClick={() => handleUpdate(item.id, item.description, item.price, item.name, item.included_in_subscription)}>
                                    <i className="bi bi-upload"></i>
                                </Button>
                                <Button variant="danger" onClick={() => handleSoftDelete(item.id)}>
                                    <i class="bi bi-trash-fill"></i>
                                </Button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </Table>
            </div>

            <Modal show={show} onHide={handleClose} size="lg" centered>
                <Modal.Header closeButton>
                    <Modal.Title>Créer un produit</Modal.Title>
                </Modal.Header>

                <Modal.Body>
                        <Form id="productForm" onSubmit={handleSubmit} >

                            <Form.Group className="mb-3">
                                <Form.Label className="form-label">Image du produit</Form.Label>
                                <Form.Control
                                    type="file"
                                    name="image"
                                    accept="image/*"
                                    className="form-control"
                                    onChange={handleChange}
                                    required
                                />
                            </Form.Group>

                            <Form.Group className="mb-3">
                                <Form.Label className="form-label">Nom du produit</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="name"
                                    className="form-control"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                />
                            </Form.Group>

                            <Form.Group className="mb-3">
                                <Form.Label className="form-label">Description</Form.Label>
                                <textarea
                                    type="text"
                                    name="description"
                                    className="form-control"
                                    value={formData.description}
                                    onChange={handleChange}
                                    required
                                />
                            </Form.Group>

                            <Form.Group className="mb-3">
                                <Form.Label className="form-label">Unité (exemple: kg)</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="unit"
                                    className="form-control"
                                    value={formData.unit}
                                    onChange={handleChange}
                                    required
                                />
                            </Form.Group>

                            <Form.Group className="mb-3">
                                <Form.Label className="form-label">Prix (€)</Form.Label>
                                <Form.Control
                                    type="number"
                                    name="price"
                                    className="form-control"
                                    value={formData.price}
                                    onChange={handleChange}
                                    required
                                    min="0"
                                    step="0.01"
                                />
                            </Form.Group>

                            <Form.Group className="form-check mb-3">
                                <Form.Control
                                    type="checkbox"
                                    className="form-check-input"
                                    name="includedInSubscription"
                                    checked={formData.includedInSubscription}
                                    onChange={handleChange}
                                />
                                <Form.Label className="form-check-label">
                                    Inclure dans l'abonnement
                                </Form.Label>
                            </Form.Group>

                        </Form>
                </Modal.Body>

                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Quitter
                    </Button>
                    <Button variant="success" onClick={() => document.getElementById('productForm').requestSubmit()}>
                        Ajouter
                    </Button>
                </Modal.Footer>
            </Modal>
        </>

    );
}

export default CreateProduct;
