import React, { useEffect, useState } from "react";
import useAuth from '../../hooks/useAuth';
import { Table, Button, Collapse, Card } from 'react-bootstrap';
import api from '../../api.js';

function Transactions() {
    const { user } = useAuth();
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [openCollapseId, setOpenCollapseId] = useState(null);
    const [orderItems, setOrderItems] = useState({});

    useEffect(() => {
        if (!user) return;

        const fetchTransactions = async () => {
            try {
                setLoading(true);
                const response = await api.get(
                    `/transaction/user/${user.id}`,
                );
                setTransactions(response.data);
            } catch (err) {
                setError("Erreur lors du chargement des transactions.");
                console.error(err);
            } finally {
                setLoading(false);
            }
        };


        fetchTransactions();
    }, [user]);

    // Fonction pour toggler l’affichage des détails d’une commande
    const toggleCollapse = async (transactionId, orderId) => {
        if (openCollapseId === transactionId) {
            // fermer si déjà ouvert
            setOpenCollapseId(null);
        } else {
            setOpenCollapseId(transactionId);

            // Charger les détails de la commande si pas déjà chargés
            if (!orderItems[orderId]) {
                try {
                    const response = await api.get(
                        `/order-item/order/${orderId}`,
                    );
                    setOrderItems(prev => ({ ...prev, [orderId]: response.data }));
                } catch (err) {
                    console.error("Erreur chargement détails commande", err);
                    setOrderItems(prev => ({ ...prev, [orderId]: [] }));
                }
            }
        }
    };

    if (loading) return <p>Chargement...</p>;
    if (error) return <p className="text-danger">{error}</p>;
    if (transactions.length === 0) return <p>Aucune transaction trouvée.</p>;

    return (
        <>
        <Card className="mt-4">
            <Card.Header>
                <h2 className="text-center my-3">Portefeuille</h2>
            </Card.Header>
            <Card.Body>
                <div className="d-flex justify-content-between">
                    <div>
                        <strong style={{ fontSize: "1.2rem" }}>Solde abonnement: </strong>
                        <span style={{ fontSize: "1.2rem" }} className={
                            user.balance < 0
                                ? "text-danger"
                                : user.balance > 0
                                    ? "text-success"
                                    : ""
                        }>{user.balance}€</span>
                    </div>
                    <div>
                        <strong style={{ fontSize: "1.2rem" }}>Solde hors abonnement: </strong>
                        <span style={{ fontSize: "1.2rem" }} className={
                            user.extra_balance < 0
                                ? "text-danger"
                                : user.extra_balance > 0
                                    ? "text-success"
                                    : ""
                        }>{user.extra_balance}€</span>
                    </div>
                    <div>

                    </div>
                </div>
            </Card.Body>
        </Card>

        <Card className="mt-4">

            <h2 className="text-center my-3">Mes Transactions</h2>

            <div className="table-responsive px-3 pb-3">
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
                    {transactions.map(transaction => (
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
                                    {transaction.type === "Abonnement" && (
                                        transaction.is_paid ? (
                                            <span style={{ color: "green", fontWeight: "bold" }}>Payé</span>
                                        ) : (
                                            <span style={{ color: "red", fontWeight: "bold" }}>Non payé</span>
                                        )
                                    )}
                                </td>
                            </tr>

                            {transaction.type === "commande" && (
                                <tr>
                                    <td colSpan="5" className="p-0 border-0">
                                        <Collapse in={openCollapseId === transaction.id}>
                                            <div id={`collapse-${transaction.id}`} className="p-3 bg-light border-top">
                                                <strong>Détails de la commande</strong>
                                                <hr />
                                                {orderItems[transaction.order_id] ? (
                                                    <>
                                                        {/* Items inclus dans l’abonnement */}
                                                        <ul className="list-group mb-3">
                                                            {orderItems[transaction.order_id]
                                                                .filter(item => item.included_in_subscription === 1)
                                                                .map(item => (
                                                                    <li
                                                                        key={item.id}
                                                                        className="list-group-item d-flex justify-content-between align-items-center"
                                                                    >
                                                                        <div>
                                                                            {item.name} — {item.quantity} {item.unit} x {item.price} €
                                                                            {item.promo > 0 && (
                                                                                <span className="ms-2 text-success">(-{item.promo}% promo)</span>
                                                                            )}
                                                                        </div>
                                                                        <div>
                                                                            <span className="ms-2 text-success">Abonnement</span>
                                                                        </div>
                                                                        <div>
                                                                            <strong>
                                                                                {(item.quantity * item.price * (1 - item.promo / 100)).toFixed(2)} €
                                                                            </strong>
                                                                        </div>
                                                                    </li>
                                                                ))}
                                                        </ul>

                                                        {/* hors abonnement */}
                                                        <ul className="list-group">
                                                            {orderItems[transaction.order_id]
                                                                .filter(item => item.included_in_subscription === 0)
                                                                .map(item => (
                                                                    <li
                                                                        key={item.id}
                                                                        className="list-group-item d-flex justify-content-between align-items-center"
                                                                    >
                                                                        <div>
                                                                            {item.name} — {item.quantity} {item.unit} x {item.price} €
                                                                            {item.promo > 0 && (
                                                                                <span className="ms-2 text-success">(-{item.promo}% promo)</span>
                                                                            )}
                                                                        </div>
                                                                        <div>
                                                                            <span className="ms-2 text-secondary">Hors abonnement</span>
                                                                        </div>
                                                                        <div>
                                                                            <strong>
                                                                                {(item.quantity * item.price * (1 - item.promo / 100)).toFixed(2)} €
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
            </div>
        </Card>
        </>

    );
}

export default Transactions;
