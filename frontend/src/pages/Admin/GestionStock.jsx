import axios from 'axios';
import React, { useState, useEffect } from 'react';
import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button'
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import Select from 'react-select';
import api from '../../api.js';




function GestionStockPage() {
    const [stockList, setStockList] = useState([]);
    const [productList, setProductList] = useState([]);
    const [show, setShow] = useState(false);
    const [productId, setProductId] = useState("");
    const [quantity, setQuantity] = useState(0);
    const [promo, setPromo] = useState(0);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    useEffect(() => {
        api.get('/stock/all_data')
            .then(response => {
                console.log(response.data)
                setStockList(response.data);
            })
            .catch(error => {
                console.error('Erreur lors de la récupération du stock :', error);
            });
    }, []);

    useEffect(() => {
        api.get('/products')
            .then(response => {
                console.log(response.data)
                setProductList(response.data);
            })
            .catch(error => {
                console.error('Erreur lors de la récupération des produits :', error);
            });
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();

        api.post('/stock', {
            product_id: productId,
            quantity: quantity,
            promo: promo
        })
            .then(() => {
                alert("Stock ajouté !");
                handleClose();

                api.get('/stock/all_data')
                    .then(res => setStockList(res.data));
            })
            .catch(err => {
                console.error("Erreur :", err);
                alert("Erreur lors de l'ajout au stock.");
            });
    };

    const handleSoftDelete = (id) => {
        if (!window.confirm("Es-tu sûr de vouloir supprimer cet élément ?")) return;

        api.delete(`/stock/${id}`)
            .then(() => {
                setStockList(prev => prev.filter(item => item.id !== id)); // supprime visuellement
            })
            .catch(error => {
                console.error("Erreur lors de la suppression :", error);
            });
    };

    const handleUpdate = (id, quantity, promo) => {
        api.put(`/stock/update/${id}`, {
            quantity,
            promo
        })
            .then(() => {
                alert("Stock mis à jour !");
            })
            .catch((error) => {
                console.error("Erreur lors de la mise à jour :", error);
            });
    };




    return (
        <>
        <div className="row">
            <div className="d-flex justify-content-end mb-3">
                <Button variant="success" onClick={handleShow}>
                    + Stock
                </Button>
            </div>

            <Modal show={show} onHide={handleClose} size="lg" centered>
                <Modal.Header closeButton>
                    <Modal.Title>Ajouter un produit au stock</Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    <Form id="newsForm" onSubmit={handleSubmit}>

                        <Form.Group className="mb-3">
                            <Form.Label>Produit</Form.Label>
                            <Select
                                options={productList.map(item => ({
                                    value: item.id,
                                    label: item.name,
                                    unit: item.unit,
                                    image: item.image_url,
                                }))}
                                onChange={(selected) => setProductId(selected.value)}
                                placeholder="-- Choisir un produit --"
                                components={{
                                    Option: ({ data, innerRef, innerProps }) => (
                                        <div ref={innerRef} {...innerProps} className="d-flex align-items-center gap-2 p-2">
                                            <img
                                                src={data.image}
                                                alt={data.label}
                                                style={{ width: '30px', height: '30px', objectFit: 'cover', borderRadius: '6px' }}
                                            />
                                            <span>{data.label} ({data.unit})</span>
                                        </div>
                                    ),
                                    SingleValue: ({ data }) => (
                                        <div className="d-flex align-items-center gap-2">
                                            <img
                                                src={data.image}
                                                alt={data.label}
                                                style={{ width: '30px', height: '30px', objectFit: 'cover', borderRadius: '6px' }}
                                            />
                                            <span>{data.label} ({data.unit})</span>
                                        </div>
                                    ),
                                }}
                                styles={{
                                    control: (provided) => ({
                                        ...provided,
                                        minHeight: '38px',
                                    }),
                                }}
                            />
                        </Form.Group>


                        <Form.Group className="mb-3">
                            <Form.Label>Quantité</Form.Label>
                            <Form.Control
                                type="number"
                                onChange={(e) => setQuantity(e.target.value)}
                                autoFocus
                                required
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Promo (en %)</Form.Label>
                            <Form.Control
                                type="float"
                                min={0}
                                max={100}
                                onChange={(e) => setPromo(e.target.value)}
                                autoFocus
                                required
                            />
                        </Form.Group>
                    </Form>
                </Modal.Body>

                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Quitter
                    </Button>
                    <Button variant="success" onClick={() => document.getElementById('newsForm').requestSubmit()}>
                        Ajouter
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>

        <Table striped bordered hover>
            <thead>
            <tr>
                <th></th>
                <th>Nom</th>
                <th>Quantité</th>
                <th>Prix</th>
                <th>Promo</th>
                <th></th>
            </tr>
            </thead>
            <tbody>
            {stockList.map((item, index) => (
                <tr key={item.id}>
                    <td>
                        <div className="d-flex align-items-center gap-2">
                            {item.product_image_url && (
                                <img
                                    src={item.product_image_url}
                                    alt={item.product_name}
                                    style={{ width: "50px", height: "50px", objectFit: "cover", borderRadius: "8px" }}
                                />
                            )}
                        </div>
                    </td>

                    <td>{item.product_name}</td>
                    <td>
                        <div className="d-flex align-items-center">
                        <input
                            type="number"
                            className="form-control bg-white text-dark w-auto"
                            value={item.quantity}
                            onChange={(e) => {
                                const newStockList = [...stockList];
                                newStockList[index].quantity = e.target.value;
                                setStockList(newStockList);
                            }}
                        />
                            <span> {item.product_unit}</span>
                        </div>
                    </td>
                    <td>{item.product_price} €/{item.product_unit}</td>
                    <td>
                        <div className="d-flex align-items-center">
                        <input
                            type="number"
                            min={0}
                            max={100}
                            className="form-control bg-white text-dark w-auto"
                            value={item.promo}
                            onChange={(e) => {
                                const newStockList = [...stockList];
                                newStockList[index].promo = e.target.value;
                                setStockList(newStockList);
                            }}
                        />
                            <span> %</span>
                        </div>
                    </td>
                    <td>
                        <Button variant="primary" aria-label="Update" onClick={() => handleUpdate(item.id, item.quantity, item.promo)}>
                            <i className="bi bi-upload"></i>
                        </Button>
                        <Button variant="danger" aria-label="Supprimer" onClick={() => handleSoftDelete(item.id)}>
                            <i class="bi bi-trash-fill"></i>
                        </Button>
                    </td>
                </tr>
            ))}
            </tbody>
        </Table>
        </>
    );
}

export default GestionStockPage;