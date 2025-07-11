import axios from 'axios';
import React, { useState, useEffect } from 'react';
import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button'
import Modal from "react-bootstrap/Modal";
import Collapse from 'react-bootstrap/Collapse';
import Form from "react-bootstrap/Form";
import api from '../../api.js';




function SuiviClientPage() {
    const [userList, setUserList] = useState([]);
    const [modifiedRows, setModifiedRows] = useState({});

    const [showTransactionModal, setShowTransactionModal] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [transactions, setTransactions] = useState([]);


    const [openCollapseId, setOpenCollapseId] = useState(null);
    const [orderItems, setOrderItems] = useState({});

    const toggleCollapse = (transactionId, orderId) => {
        if (openCollapseId === transactionId) {
            setOpenCollapseId(null);
        } else {
            setOpenCollapseId(transactionId);

            if (!orderItems[orderId]) {
                api.get(`/order-item/order/${orderId}`)
                    .then((response) => {
                        setOrderItems(prev => ({
                            ...prev,
                            [orderId]: response.data
                        }));
                    })
                    .catch((error) => {
                        console.error("Erreur lors du chargement des items :", error);
                    });
            }
        }
    };




    useEffect(() => {
        api.get('/user')
            .then(response => {
                console.log(response.data)
                setUserList(response.data);
            })
            .catch(error => {
                console.error('Erreur lors de la récupération des données des utilisateurs :', error);
            });
    }, []);

    const balanceUpdate = (id, balance, extra_balance) => {
        api.put(`/user/update/${id}`, {
            balance,
            extra_balance
        })
            .then(() => {
                alert("User mis à jour !");
            })
            .catch((error) => {
                console.error("Erreur lors de la mise à jour :", error);
            });
    };

    const handleInputChange = (index, field, value) => {
        const newUserList = [...userList];
        newUserList[index][field] = value;
        setUserList(newUserList);

        const userId = newUserList[index].id;
        setModifiedRows(prev => ({ ...prev, [userId]: true }));
    };

    const fetchTransactions = (userId) => {
        api.get(`/transaction/user/${userId}`)
            .then(response => {
                setTransactions(response.data);
                setShowTransactionModal(true);
            })
            .catch(error => {
                console.error("Erreur lors de la récupération des transactions :", error);
            });
    };


    return (
        <>
                <h1>Suivi client</h1>

                <Table striped bordered hover>
                    <thead>
                    <tr>
                        <th>Nom</th>
                        <th>Prénom</th>
                        <th>Mail</th>
                        <th>Abonement</th>
                        <th>Balance</th>
                        <th>Balance Extras</th>
                        <th></th>
                    </tr>
                    </thead>
                    <tbody>
                    {userList.map((item, index) => (
                        <tr>
                            <td>{item.first_name}</td>
                            <td>{item.last_name}</td>
                            <td>{item.email}</td>
                            <td>{item.subscriptions_id}</td>
                            <td>
                                <div className="d-flex align-items-center">
                                    <input
                                        type="number"
                                        className="form-control bg-white text-dark "
                                        style={{ width: "11ch" }}
                                        value={item.balance}
                                        onChange={(e) => handleInputChange(index, "balance", e.target.value)}

                                    />
                                    <span>€</span>
                                </div>
                            </td>
                            <td>
                                <div className="d-flex align-items-center">
                                    <input
                                        type="number"
                                        className="form-control bg-white text-dark"
                                        style={{ width: "11ch" }}
                                        value={item.extra_balance}
                                        onChange={(e) => handleInputChange(index, "extra_balance", e.target.value)}

                                    />
                                    <span>€</span>
                                </div>
                            </td>
                            <td>
                                <Button
                                    variant={modifiedRows[item.id] ? "warning" : "success"}
                                    className="me-2"
                                    onClick={() => {
                                        balanceUpdate(item.id, item.balance, item.extra_balance);

                                        // Réinitialise la couleur
                                        setModifiedRows(prev => {
                                            const newState = { ...prev };
                                            delete newState[item.id];
                                            return newState;
                                        });
                                    }}
                                >
                                    <i className="bi bi-pencil-square"></i>
                                </Button>

                                <Button variant="primary" className="me-2">
                                    <i className="bi bi-envelope-arrow-up"></i>
                                </Button>

                                <Button className="me-2" variant="info" onClick={() => {
                                    setSelectedUser(item);
                                    fetchTransactions(item.id);
                                }}>
                                    <i className="bi bi-receipt"></i>
                                </Button>

                                <Button variant="danger" className="me-2">
                                    <i className="bi bi-trash-fill"></i>
                                </Button>

                            </td>
                        </tr>
                    ))}
                    </tbody>
                </Table>


            {/* Modal avec l'historique des transactions */}

            <Modal show={showTransactionModal} onHide={() => setShowTransactionModal(false)} size="lg">
                <Modal.Header closeButton>
                    <Modal.Title>Transactions de {selectedUser?.first_name} {selectedUser?.last_name}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {transactions.length > 0 ? (
                        <Table striped bordered hover>
                            <thead>
                            <tr>
                                <th>Date</th>
                                <th>Montant</th>
                                <th>Type</th>
                                <th>Description</th>
                                <th></th>
                            </tr>
                            </thead>
                            <tbody>
                            {transactions.map((transaction) => (
                                <React.Fragment key={transaction.id}>
                                    <tr>
                                        <td>{new Date(transaction.created_at).toLocaleString()}</td>
                                        <td>{transaction.amount} €</td>
                                        <td>{transaction.type}</td>
                                        <td>{transaction.description}</td>
                                        <td>
                                            {transaction.type === "commande" && (
                                                <Button
                                                    size="sm"
                                                    variant="outline-primary"
                                                    onClick={() => toggleCollapse(transaction.id, transaction.order_id)}
                                                    aria-controls={`collapse-${transaction.id}`}
                                                    aria-expanded={openCollapseId === transaction.id}
                                                >
                                                    Voir détails
                                                </Button>
                                            )}
                                        </td>
                                    </tr>

                                    {transaction.type === "commande" && (
                                        <tr>
                                            <td colSpan="5" className="p-0 border-0">


                                                {/* Collapse avec le détail des commandes */}

                                                <Collapse in={openCollapseId === transaction.id}>
                                                    <div id={`collapse-${transaction.id}`} className="p-3 bg-light border-top">
                                                        <strong>Détails de la commande</strong>
                                                        <hr />
                                                        {orderItems[transaction.order_id] ? (
                                                            <ul className="list-group">
                                                                {orderItems[transaction.order_id].map((item) => (
                                                                    <li
                                                                        key={item.id}
                                                                        className="list-group-item d-flex justify-content-between align-items-center"
                                                                    >
                                                                        <div>
                                                                            {item.name} — {item.quantity} {item.unit} X {item.price} €
                                                                            {item.promo > 0 && (
                                                                                <span className="ms-2 text-success">(-{item.promo}% promo)</span>
                                                                            )}
                                                                        </div>
                                                                        <div>
                                                                            <strong>
                                                                                {(
                                                                                    item.quantity *
                                                                                    item.price *
                                                                                    (1 - item.promo / 100)
                                                                                ).toFixed(2)}{" "}
                                                                                €
                                                                            </strong>
                                                                        </div>
                                                                    </li>
                                                                ))}
                                                            </ul>
                                                        ) : (
                                                            <p>Chargement des détails...</p>
                                                        )}
                                                    </div>
                                                </Collapse>
                                            </td>
                                        </tr>
                                    )}
                                </React.Fragment>
                            ))}
                            </tbody>

                        </Table>
                    ) : (
                        <p>Aucune transaction trouvée.</p>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowTransactionModal(false)}>Fermer</Button>
                </Modal.Footer>
            </Modal>

        </>
    );
}

export default SuiviClientPage;