import React, { useEffect, useState } from 'react';
import { Form, ListGroup, InputGroup, FormCheck, Button, Modal, Card } from "react-bootstrap";
import { useLocation, useNavigate } from "react-router-dom";
import api from '../../api.js';




function ProductsPage() {
    const [products, setProducts] = useState([]);
    const [selectedItems, setSelectedItems] = useState({});
    const [showModal, setShowModal] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();
    const client = location.state?.client;
    const [modalProduct, setModalProduct] = useState(null);

    useEffect(() => {
        api.get("/stock/")
            .then(response => {
                setProducts(response.data);
            })
            .catch(error => {
                console.error("Erreur lors du chargement du stock :", error);
            });
    }, []);

    if (!client) {
        navigate("/hub/user-selecte");
        return null;
    }

    const handleQuantityChange = (productId, value) => {
        let numericValue = parseFloat(value);

        const product = products.find(p => p.id === productId);
        if (!product) return;

        const max = product.quantity;

        if (isNaN(numericValue) || numericValue < 0) {
            numericValue = 0;
        }

        if (numericValue > max) {
            numericValue = max;
        }

        setSelectedItems(prev => ({
            ...prev,
            [productId]: {
                ...prev[productId],
                quantity: numericValue
            }
        }));
    };



    const handleCheckboxChange = (productId, isChecked) => {
        setSelectedItems(prev => ({
            ...prev,
            [productId]: {
                ...prev[productId],
                selected: isChecked
            }
        }));
    };

    const selectedProducts = products.filter(product =>
        selectedItems[product.id]?.selected &&
        selectedItems[product.id]?.quantity > 0
    );

    const handleValidateOrder = async () => {
        try {

            const totalAmount = selectedProducts.reduce((acc, product) => {
                const quantity = parseFloat(selectedItems[product.id].quantity);
                const priceUnit = product.promo > 0
                    ? product.product_price * (1 - product.promo / 100)
                    : product.product_price;
                return acc + quantity * priceUnit;
            }, 0);

            const totalIncluded = selectedProducts.reduce((acc, product) => {
                if (product.included === 1) {
                    const quantity = parseFloat(selectedItems[product.id].quantity);
                    const priceUnit = product.promo > 0
                        ? product.product_price * (1 - product.promo / 100)
                        : product.product_price;
                    return acc + quantity * priceUnit;
                }
                return acc;
            }, 0);

            const totalNotIncluded = selectedProducts.reduce((acc, product) => {
                if (product.included !== 1) {
                    const quantity = parseFloat(selectedItems[product.id].quantity);
                    const priceUnit = product.promo > 0
                        ? product.product_price * (1 - product.promo / 100)
                        : product.product_price;
                    return acc + quantity * priceUnit;
                }
                return acc;
            }, 0);

            const orderResponse = await api.post("/order/create", {
                user_id: client.id
            });
            const orderId = orderResponse.data.id;

            const orderItemRequests = selectedProducts.map(product => {
                const quantity = parseFloat(selectedItems[product.id].quantity);
                const promo = product.promo > 0 ? product.promo : 0;

                return api.post("/order-item/create", {
                    order_id: orderId,
                    product_id: product.product_id,
                    quantity,
                    promo,
                    price: product.product_price,
                    included_in_subscription: product.included,
                });
            });

            await Promise.all(orderItemRequests);

            await api.post("/transaction/create", {
                user_id: client.id,
                amount: totalAmount,
                type: "commande",
                order_id: orderId,
                comment: ""
            });

            let remainingBalance = parseFloat(client.balance);
            let remainingExtra = parseFloat(client.extra_balance);

            let includedToPay = totalIncluded;
            let extraToPay = totalNotIncluded;

            if (remainingBalance < includedToPay) {
                // On prend tout le solde abonnement
                const fromBalance = remainingBalance;
                const fromExtra = includedToPay - fromBalance;

                includedToPay = fromBalance; // Ce qui sera retiré du solde abonnement
                extraToPay += fromExtra; // extra a enlever
            }

            if (includedToPay > 0) {
                console.log("Montant à retirer du balance :", includedToPay, "Montant à retirer du extra :", extraToPay);

                await api.put(`/user/update/subtract/${client.id}`, {
                    amount: includedToPay
                });
            }

            if (extraToPay > 0) {
                await api.put(`/user/update/subtract/balance/extra/${client.id}`, {
                    amount: extraToPay
                });
            }


            // Diminution du stock après la création de la commande
            const stockUpdateRequests = selectedProducts.map(product => {
                const quantity = parseFloat(selectedItems[product.id].quantity);

                return api.put(`/stock/decrease/${product.id}`,
                    { quantityToSubtract: quantity },
                    { withCredentials: true }
                );
            });

            await Promise.all(stockUpdateRequests);


            alert("Commande validée avec succès !");
            setShowModal(false);
            setSelectedItems({});


            navigate("/hub/user-selecte");

        } catch (error) {
            console.error("Erreur lors de la validation de la commande :", error);
            alert("Erreur lors de la validation. Veuillez réessayer.");
        }
    };



    return (
        <>
        <style>
            {`
            .big-checkbox input[type="checkbox"] {
                width: 2rem;
                height: 2rem;
                cursor: pointer;
                accent-color: #14532d; 
            }

            .big-checkbox input[type="checkbox"]:checked {
                background-color: #14532d;
                border-color: #14532d;
            }
        `}
        </style>

        <div className="container-fluid">
            <h2>Panier</h2>

            <Card className="mb-5 w-50">
                <Card.Header>
                    <h4>Portefeuille de: {client.first_name} {client.last_name}</h4>
                </Card.Header>
                <Card.Body>
                    <div className="d-flex justify-content-between">
                        <div>
                            <strong style={{ fontSize: "1.2rem" }}>Solde abonnement: </strong>
                            <span style={{ fontSize: "1.2rem" }} className={
                                client.balance < 0
                                    ? "text-danger"
                                    : client.balance > 0
                                        ? "text-success"
                                        : ""
                            }>{client.balance}€</span>
                        </div>
                        <div>
                            <strong style={{ fontSize: "1.2rem" }}>Solde hors abonnement: </strong>
                            <span style={{ fontSize: "1.2rem" }} className={
                                client.extra_balance < 0
                                    ? "text-danger"
                                    : client.extra_balance > 0
                                        ? "text-success"
                                        : ""
                            }>{client.extra_balance}€</span>
                        </div>
                        <div>

                        </div>
                    </div>
                </Card.Body>
            </Card>

            <Card>
            <Form>
                <ListGroup.Item variant="success" className="text-center">
                    <strong>Produits abonnement</strong>
                </ListGroup.Item>

                <ListGroup>
                    {products
                        .filter(product => product.included === 1)
                        .map(product => (
                        <ListGroup.Item key={product.id} className="d-flex justify-content-between align-items-center">

                            <div className="d-flex align-items-center gap-2" style={{ marginRight: '10px', marginLeft: '10px' }}>
                                {product.product_image_url && (
                                    <img
                                        src={product.product_image_url}
                                        alt={product.product_name}
                                        style={{ width: "50px", height: "50px", objectFit: "cover", borderRadius: "8px" }}
                                    />
                                )}
                            </div>

                            <div style={{ maxWidth: '500%', marginRight: '10px' }}>
                                <h3>
                                    {product.product_name}
                                    <i
                                        className="bi bi-info-circle"
                                        style={{ marginLeft: '10px', cursor: 'pointer', color: 'black' }}
                                        onClick={() => setModalProduct(product)}
                                    ></i>
                                </h3>
                                <span style={{ fontSize: '20px' }}>(Stock: {product.quantity} {product.product_unit})</span>
                            </div>

                            <div style={{ margin: '0 10px' }}>
                                {product.promo > 0 ? (
                                    <div>
                                        <h3 style={{ marginBottom: 0, color: '#dc2626' }}>
                                            {product.product_price * (1 - product.promo / 100).toFixed(2)} €/{product.product_unit}
                                        </h3>
                                        <small>
                                            <s style={{ color: '#6b7280', fontSize: '20px' }}>{product.product_price} €</s>{' '}
                                            <span style={{ color: '#16a34a', fontSize: '20px' }}>-{product.promo}%</span>
                                        </small>
                                    </div>
                                ) : (
                                    <h3>
                                        {product.product_price} € / {product.product_unit}
                                    </h3>
                                )}
                            </div>


                            <InputGroup style={{ width: "150px", marginLeft: 'auto', marginRight: "15px" }}>
                                <Form.Control
                                    type="number"
                                    min={0}
                                    max={product.quantity}
                                    value={selectedItems[product.id]?.quantity || ""}
                                    onChange={(e) => handleQuantityChange(product.id, e.target.value)}
                                />
                                <InputGroup.Text>{product.product_unit}</InputGroup.Text>
                            </InputGroup>

                            <Form.Label style={{marginTop: 'auto', marginBottom: "auto"}}> Ajouter: </Form.Label>
                            <FormCheck
                                style={{marginTop: 'auto', marginBottom: "auto"}}
                                type="checkbox"
                                className="big-checkbox"
                                checked={selectedItems[product.id]?.selected || false}
                                onChange={(e) => handleCheckboxChange(product.id, e.target.checked)}
                            />
                        </ListGroup.Item>
                    ))}
                </ListGroup>

                <ListGroup.Item variant="secondary" className="text-center">
                    <strong>Produits hors abonnement</strong>
                </ListGroup.Item>

                <ListGroup>
                    {products
                        .filter(product => product.included === 0)
                        .map(product => (
                            <ListGroup.Item key={product.id} className="d-flex justify-content-between align-items-center">

                                <div className="d-flex align-items-center gap-2" style={{ marginRight: '10px', marginLeft: '10px' }}>
                                    {product.product_image_url && (
                                        <img
                                            src={product.product_image_url}
                                            alt={product.product_name}
                                            style={{ width: "50px", height: "50px", objectFit: "cover", borderRadius: "8px" }}
                                        />
                                    )}
                                </div>

                                <div style={{ maxWidth: '500%', marginRight: '10px' }}>
                                    <h3>
                                        {product.product_name}
                                        <i
                                        className="bi bi-info-circle"
                                        style={{ marginLeft: '10px', cursor: 'pointer', color: 'black' }}
                                        onClick={() => setModalProduct(product)}
                                    ></i>
                                    </h3>
                                    <span style={{ fontSize: '20px' }}>(Stock: {product.quantity} {product.product_unit})</span>
                                </div>

                                <div style={{ margin: '0 10px' }}>
                                    {product.promo > 0 ? (
                                        <div>
                                            <h3 style={{ marginBottom: 0, color: '#dc2626' }}>
                                                {product.product_price * (1 - product.promo / 100).toFixed(2)} €/{product.product_unit}
                                            </h3>
                                            <small>
                                                <s style={{ color: '#6b7280', fontSize: '20px' }}>{product.product_price} €</s>{' '}
                                                <span style={{ color: '#16a34a', fontSize: '20px' }}>-{product.promo}%</span>
                                            </small>
                                        </div>
                                    ) : (
                                        <h3>
                                            {product.product_price} € / {product.product_unit}
                                        </h3>
                                    )}
                                </div>

                                <InputGroup style={{ width: "150px", marginLeft: 'auto', marginRight: "15px" }}>
                                    <Form.Control
                                        type="number"
                                        min={0}
                                        value={selectedItems[product.id]?.quantity || ""}
                                        onChange={(e) => handleQuantityChange(product.id, e.target.value)}
                                    />
                                    <InputGroup.Text>{product.product_unit}</InputGroup.Text>
                                </InputGroup>

                                <Form.Label style={{marginTop: 'auto', marginBottom: "auto"}}> Ajouter: </Form.Label>
                                <FormCheck
                                    style={{marginTop: 'auto', marginBottom: "auto"}}
                                    type="checkbox"
                                    className="big-checkbox"
                                    checked={selectedItems[product.id]?.selected || false}
                                    onChange={(e) => handleCheckboxChange(product.id, e.target.checked)}
                                />
                            </ListGroup.Item>
                        ))}
                </ListGroup>
            </Form>
            </Card>

            <div className="mt-4 d-flex justify-content-end">
                <Button variant="success" onClick={() => setShowModal(true)}>
                    Voir le ticket
                </Button>
            </div>
        </div>

    {/* MODALE DU TICKET */}
            <Modal show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Ticket du panier</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {selectedProducts.length === 0 ? (
                        <p>Aucun produit sélectionné.</p>
                    ) : (
                        <>
                            {/* Produits Abonnement */}
                            <h5 className="text-success text-center mb-3">Produits abonnement</h5>
                            <ul>
                                {selectedProducts.filter(p => p.included === 1).map(product => {
                                    const quantity = parseFloat(selectedItems[product.id].quantity);
                                    const priceUnit = Number(product.promo) > 0
                                        ? Number(product.product_price) * (1 - Number(product.promo) / 100)
                                        : Number(product.product_price);
                                    const total = priceUnit * quantity;

                                    return (
                                        <li key={product.id}>
                                            <strong>{product.product_name}</strong> — {quantity} {product.product_unit} × {priceUnit.toFixed(2)} € = <strong>{total.toFixed(2)} €</strong>
                                            {product.promo > 0 && (
                                                <span style={{ color: '#16a34a', marginLeft: '8px' }}>(-{product.promo}%)</span>
                                            )}
                                        </li>
                                    );
                                })}
                            </ul>

                            {/* Produits Hors Abonnement */}
                            <h5 className="text-secondary text-center mt-4 mb-3">Produits hors abonnement</h5>
                            <ul>
                                {selectedProducts.filter(p => p.included === 0).map(product => {
                                    const quantity = parseFloat(selectedItems[product.id].quantity);
                                    const priceUnit = Number(product.promo) > 0
                                        ? Number(product.product_price) * (1 - Number(product.promo) / 100)
                                        : Number(product.product_price);
                                    const total = priceUnit * quantity;

                                    return (
                                        <li key={product.id}>
                                            <strong>{product.product_name}</strong> — {quantity} {product.product_unit} × {priceUnit.toFixed(2)} € = <strong>{total.toFixed(2)} €</strong>
                                            {product.promo > 0 && (
                                                <span style={{ color: '#16a34a', marginLeft: '8px' }}>(-{product.promo}%)</span>
                                            )}
                                        </li>
                                    );
                                })}
                            </ul>

                            <hr />
                            <h5 className="text-end">
                                Total :{" "}
                                <strong>
                                    {selectedProducts.reduce((acc, product) => {
                                        const quantity = parseFloat(selectedItems[product.id].quantity);
                                        const priceUnit = product.promo > 0
                                            ? product.product_price * (1 - product.promo / 100)
                                            : product.product_price;
                                        return acc + quantity * priceUnit;
                                    }, 0).toFixed(2)} €</strong>
                            </h5>
                        </>
                    )}
                </Modal.Body>

                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowModal(false)}>
                        Fermer
                    </Button>
                    {selectedProducts.length > 0 && (
                        <Button variant="success" onClick={handleValidateOrder} disabled={selectedProducts.length === 0}>
                            Valider la commande
                        </Button>
                    )}
                </Modal.Footer>

            </Modal>

            <Modal show={modalProduct !== null} onHide={() => setModalProduct(null)}>
                <Modal.Header closeButton>
                    <Modal.Title>{modalProduct?.product_name}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>{modalProduct?.product_description || "Pas de description disponible."}</p>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setModalProduct(null)}>
                        Fermer
                    </Button>
                </Modal.Footer>
            </Modal>

        </>


    );
}

export default ProductsPage;
