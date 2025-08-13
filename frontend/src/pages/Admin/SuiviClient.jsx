import React, { useState, useEffect } from 'react';
import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button'
import Modal from "react-bootstrap/Modal";
import Collapse from 'react-bootstrap/Collapse';
import Form from "react-bootstrap/Form";
import api from '../../api.js';




function SuiviClientPage() {
    const [userList, setUserList] = useState([]);

    const [showTransactionModal, setShowTransactionModal] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [transactions, setTransactions] = useState([]);


    const [openCollapseId, setOpenCollapseId] = useState(null);
    const [orderItems, setOrderItems] = useState({});

    const today = new Date();
    const formattedDate = today.toLocaleDateString('fr-BE');

    const [showFormModal, setShowFormModal] = useState(false);
    const [formData, setFormData] = useState({
        number: '',
        checkbox: false,
        textarea: ''
    });


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

    const handleAddTransaction = async () => {
        if (!selectedUser) return;

        const payload = {
            id: selectedUser.id,
            amount: parseFloat(formData.number),
            comment: formData.textarea
        };

        try {
            if (formData.checkbox) {
                await api.put(`user/update/balance/extra/${selectedUser.id}`, {amount: parseFloat(formData.number), comment: formData.textarea});
                await api.post(`transaction/create/`, {user_id: selectedUser.id, amount: parseFloat(formData.number), type:"Payment extra", order_id: null, comment: ""});
            } else {
                await api.put(`user/update/balance/${selectedUser.id}`, {amount: parseFloat(formData.number), comment: formData.textarea});
                await api.post(`transaction/create/`, {user_id: selectedUser.id, amount: parseFloat(formData.number), type:"Payment", order_id: null, comment: ""});

            }

            alert('Transaction enregistrée avec succès !');
            setShowFormModal(false);
            window.location.reload();
        } catch (error) {
            console.error("Erreur lors de l'envoi :", error);
            alert("Erreur lors de l'envoi du formulaire.");
        }
    }

    const handleSubTransaction = async (userId, amount) => {
        try {
            await api.put(`user/update/balance/${userId}`, {amount: parseFloat(amount)});
            await api.post('transaction/create/', {
                user_id: userId,
                amount: amount,
                type: 'Abonnement',
                order_id: null,
                comment: `Paiement de l'abonnement le ${formattedDate}`
            });

            alert('Transaction créée avec succès');
        } catch (error) {
            console.error('Erreur lors de la création de la transaction :', error);
            alert("Erreur lors de la création de la transaction");
        }
    };



    useEffect(() => {
        api.get('/user/all-client/information')
            .then(response => {
                console.log(response.data)
                setUserList(response.data);
            })
            .catch(error => {
                console.error('Erreur lors de la récupération des données des utilisateurs :', error);
            });
    }, []);


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

    const deleteUser = async (userId) => {
        if (window.confirm("Voulez-vous vraiment supprimer ce client ?")) {
            try {
                api.delete(`/user/delete/${userId}`);
                setUserList(prev => prev.filter(p => p.id !== userId));
            } catch (error) {
                alert("Erreur lors de la suppression du client");
                console.error(error);
            }
        }
    };

    const sendMail = async (user) => {
        if (window.confirm(`Voulez-vous vraiment un mail de rappel a ${user.first_name} ${user.last_name } ?`)) {
            try {
                await api.post('/mail/send-mail', {
                        toEmail: user.email,
                        firstName: user.first_name,
                        lastName: user.last_name,
                        userId: user.id,

                });
                alert("Le mail à bien été envoyé");
            } catch (error) {
                console.error(error);
                alert('Erreur lors de l\'envoi du mail');
            }
        }
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
                        <th></th>
                    </tr>
                    </thead>
                    <tbody>
                    {userList.map((item, index) => (
                        <tr>
                            <td>{item.first_name}</td>
                            <td>{item.last_name}</td>
                            <td>{item.email}</td>
                            <td>
                                {item.subscription_name?.trim()
                                    ? `${item.subscription_name} - ${item.subscription_price}€/mois`
                                    : 'Aucun abonnement'}
                            </td>
                            <td>
                                <div className="d-flex align-items-center">
                                    <span className={
                                        item.balance < 0
                                            ? "text-danger"
                                            : item.balance > 0
                                                ? "text-success"
                                                : ""
                                    }>{item.balance}€</span>
                                </div>
                            </td>
                            <td>
                                <div className="d-flex align-items-center">
                                    <span className={
                                                       item.balance < 0
                                                           ? "text-danger"
                                                           : item.balance > 0
                                                               ? "text-success"
                                                               : ""
                                    }>{item.extra_balance}€</span>
                                </div>
                            </td>
                            <td>
                                <Button
                                    variant="warning"
                                    className="me-2"
                                    onClick={() => {
                                        setSelectedUser(item);
                                        setFormData({ number: '', checkbox: false, textarea: '' });
                                        setShowFormModal(true);
                                    }}
                                >
                                    <i className="bi bi-pencil-square"></i>
                                </Button>

                                <Button className="me-2" variant="info" onClick={() => {
                                    setSelectedUser(item);
                                    fetchTransactions(item.id);
                                }}>
                                    <i className="bi bi-receipt"></i>
                                </Button>

                                <Button
                                    className="me-2"
                                    variant="success"
                                    onClick={() => handleSubTransaction(item.id, item.subscription_price)}
                                >
                                    <i className="bi bi-cash-coin"></i>
                                </Button>

                                <Button variant="primary" className="me-2" onClick={() => sendMail(item)}>
                                    <i className="bi bi-envelope-arrow-up"></i>
                                </Button>
                            </td>
                            <td>
                                <Button variant="danger" className="me-2" onClick={() => deleteUser(item.id)}>
                                    <i className="bi bi-trash-fill"></i>
                                </Button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </Table>

            {/* Modal ajouter transactions */}
            <Modal
                show={showFormModal}
                onHide={() => setShowFormModal(false)}
                centered
            >
                <Modal.Header closeButton>
                    <Modal.Title>Création de payment – {selectedUser?.first_name} {selectedUser?.last_name}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-3" controlId="formCheckbox">
                            <Form.Check
                                type="checkbox"
                                label="Cocher si payment extra"
                                checked={formData.checkbox}
                                onChange={(e) => setFormData({ ...formData, checkbox: e.target.checked })}
                            />
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="formNumber">
                            <Form.Label>Montant (€)</Form.Label>
                            <Form.Control
                                type="number"
                                step="0.01"
                                value={formData.number}
                                onChange={(e) => setFormData({ ...formData, number: e.target.value })}
                                placeholder="0.00"
                            />
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="formTextarea">
                            <Form.Label>Commentaire (facultatif)</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={3}
                                value={formData.textarea}
                                onChange={(e) => setFormData({ ...formData, textarea: e.target.value })}
                                placeholder="Ajouter un commentaire..."
                            />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowFormModal(false)}>
                        Annuler
                    </Button>
                    <Button variant="primary" onClick={handleAddTransaction}>
                        Valider
                    </Button>
                </Modal.Footer>
            </Modal>


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
                                <th>Commentaire</th>
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
                                        <td>{transaction.comment}</td>
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
                                                            <>
                                                                <ul className="list-group">
                                                                    {orderItems[transaction.order_id]
                                                                        .filter((item) => item.included_in_subscription === 1)
                                                                        .map((item) => (
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
                                                                                <span className="ms-2 text-success">Abonnement</span>
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

                                                                <ul className="list-group">
                                                                    {orderItems[transaction.order_id]
                                                                        .filter((item) => item.included_in_subscription === 0)
                                                                        .map((item) => (
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
                                                                                    <span className="ms-2 text-secondary">Hors abonnement</span>
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
                                                            </>
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