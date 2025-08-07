import React, {useEffect, useState} from "react";
import api from '../../api.js';
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";



function CreateSubscription() {
    const [subscriptionList, setSubscriptionList] = useState([]);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const [show, setShow] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        description: "",
        price: "",
    });

    useEffect(() => {
        api.get('/subscriptions/all')
            .then(response => {
                setSubscriptionList(response.data);
            })
            .catch(error => {
                console.error('Erreur lors de la récupération des abonnements :', error);
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

        api.post('/subscriptions/add', {
            name: formData.name,
            description: formData.description,
            price: formData.price,
        })
            .then(() => {
                alert("Abonnement ajouté !");
                handleClose();
                window.location.reload();
            })
            .catch(err => {
                console.error("Erreur :", err);
                alert("Erreur lors de l'ajout de l'abonnement.");
            });
    };

    return (
        <>
            <div className="d-flex justify-content-end mb-3">
                <Button variant="success" onClick={handleShow}>
                    + Abonnement
                </Button>
            </div>

            <div className="container mt-4">
                <div className="row">
                    {subscriptionList.map((subscription, index) => (
                        <div key={index} className="col-12 col-md-6 col-lg-4 mb-4">
                            <div className="card h-100 shadow-sm rounded-4 position-relative">
                                <div className="card-body d-flex flex-column">
                                    <div className="position-absolute top-0 end-0 m-2 d-flex align-items-center">
                                        <label className="me-2">visible:</label>
                                        <Form.Check
                                            type="checkbox"
                                            checked={subscription.visible}
                                            onChange={async () => {
                                                try {
                                                    await api.put(`/subscriptions/visibility/${subscription.id}`, {
                                                        visible: !subscription.visible
                                                    });

                                                    setSubscriptionList(prev =>
                                                        prev.map(p =>
                                                            p.id === subscription.id ? { ...p, visible: !p.visible } : p
                                                        )
                                                    );
                                                } catch (error) {
                                                    alert("Erreur lors de la mise à jour de la visibilité");
                                                    console.error(error);
                                                }
                                            }}
                                        />
                                    </div>

                                    <h4 className="card-title mt-4 text-center">{subscription.name}</h4>
                                    <p className="card-text text-center flex-grow-1">{subscription.description}</p>
                                    <h6 className="mt-3 fw-bold text-center">{subscription.price} €</h6>

                                    <div className="d-flex justify-content-between mt-auto">
                                        <Button
                                            variant="danger"
                                            className="me-0"
                                            onClick={async () => {
                                                if (window.confirm("Voulez-vous vraiment supprimer cet abonnement ?")) {
                                                    try {
                                                        await api.delete(`/subscriptions/${subscription.id}`);
                                                        setSubscriptionList(prev => prev.filter(p => p.id !== subscription.id));
                                                    } catch (error) {
                                                        alert("Erreur lors de la suppression de l’abonnement");
                                                        console.error(error);
                                                    }
                                                }
                                            }}
                                        >
                                            <i className="bi bi-trash-fill"></i>
                                        </Button>
                                    </div>
                                </div>
                            </div>

                        </div>
                    ))}
                </div>
            </div>


            <Modal show={show} onHide={handleClose} size="lg" centered>
                <Modal.Header closeButton>
                    <Modal.Title>Créer un abonnement</Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    <Form id="subscriptionForm" onSubmit={handleSubmit} >

                        <Form.Group className="mb-3">
                            <Form.Label className="form-label">Nom de l'abonnement</Form.Label>
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
                    </Form>
                </Modal.Body>

                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Quitter
                    </Button>
                    <Button variant="success" onClick={() => document.getElementById('subscriptionForm').requestSubmit()}>
                        Créer
                    </Button>
                </Modal.Footer>
            </Modal>
        </>

    );
}

export default CreateSubscription;
