import React, { useEffect, useState } from "react";
import api from '../../api.js';
import Button from "react-bootstrap/Button";
import useAuth from "../../hooks/useAuth.js";

function PageSubscription() {
    const [subscriptionList, setSubscriptionList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { user } = useAuth();
    const userId = user?.id;
    const [updating, setUpdating] = useState(false);

    useEffect(() => {
        if (!userId) {
            setError("L'ID utilisateur est requis.");
            setLoading(false);
            return;
        }

        setLoading(true);
        setError(null);

        api.get(`/subscriptions/user?userId=${userId}`)
            .then(response => {
                setSubscriptionList(response.data);
                setLoading(false);
            })
            .catch(() => {
                setError("Erreur lors de la récupération des abonnements.");
                setLoading(false);
            });

    }, [userId]);

    const userSubscriptionId = subscriptionList.length === 1 ? subscriptionList[0].id : null;

    const handleSubscribe = (subscriptionId) => {
        setUpdating(true);
        api.put(`/user/update/subscription/${userId}`, { subscriptionId })
            .then(() => {
                return api.get(`/subscriptions/user?userId=${userId}`);
            })
            .then(response => {
                setSubscriptionList(response.data);
                setUpdating(false);
            })
            .catch(() => {
                setError("Erreur lors de la mise à jour de l'abonnement.");
                setUpdating(false);
            });
    };

    if (loading) return <div className="container mt-4">Chargement...</div>;
    if (error) return <div className="container mt-4 text-danger">{error}</div>;
    if (subscriptionList.length === 0) return <div className="container mt-4">Aucun abonnement disponible.</div>;

    return (
        <div className="container mt-4">
            <div className="row">
                {subscriptionList.map((subscription, index) => (
                    <div key={index} className="col-12 col-md-6 col-lg-4 mb-4">
                        <div className="card h-100 shadow-sm rounded-4 position-relative">
                            <div className="card-body d-flex flex-column">
                                <h5 className="card-title text-center">{subscription.name}</h5>
                                <p className="card-text text-center flex-grow-1">{subscription.description}</p>
                                <h6 className="mt-3 fw-bold text-center">{subscription.price} €</h6>
                                {subscription.id !== userSubscriptionId && (
                                    <Button
                                        variant="primary"
                                        className="mt-auto"
                                        onClick={() => handleSubscribe(subscription.id)}
                                        disabled={updating}
                                    >
                                        {updating ? "Mise à jour..." : "S'abonner"}
                                    </Button>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}


export default PageSubscription;
