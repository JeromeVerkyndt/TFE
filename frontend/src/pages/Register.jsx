import React, { useState } from "react";
import axios from "axios";
import Card from "react-bootstrap/Card";
import CardTitle from "react-bootstrap/CardTitle";
import Form from "react-bootstrap/Form";
import { Link } from "react-router-dom";
import Button from "react-bootstrap/Button";
import api from '../api.js';

const Register = () => {
    const [formData, setFormData] = useState({
        email: "",
        password: "",
        first_name: "",
        last_name: "",
    });

    const handleChange = (e) => {
        setFormData(prev => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post("/auth/register", formData);
            alert("Compte créé !");
        } catch (err) {
            console.error(err);
            alert("Erreur à l'enregistrement");
        }
    };

    return (
        <div className="container d-flex justify-content-center align-items-start min-vh-100 pt-5">
            <div className="col-12 col-sm-10 col-md-8 col-lg-6">
                <Card className="p-4 shadow">
                    <CardTitle className="mb-3 text-center">
                        <h2>S'inscrire</h2>
                    </CardTitle>

                    <Form onSubmit={handleSubmit}>
                        <Form.Group className="mb-3" controlId="formFirstName">
                            <Form.Label>Prénom</Form.Label>
                            <Form.Control
                                name="first_name"
                                type="text"
                                placeholder="Prénom"
                                value={formData.first_name}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="formLastName">
                            <Form.Label>Nom</Form.Label>
                            <Form.Control
                                name="last_name"
                                type="text"
                                placeholder="Nom"
                                value={formData.last_name}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="formBasicEmail">
                            <Form.Label>Email</Form.Label>
                            <Form.Control
                                name="email"
                                type="email"
                                placeholder="Adresse e-mail"
                                value={formData.email}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="formBasicPassword">
                            <Form.Label>Mot de passe</Form.Label>
                            <Form.Control
                                name="password"
                                type="password"
                                placeholder="Mot de passe"
                                value={formData.password}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>

                        <Card.Text className="mb-3">
                            Vous avez déjà un compte ? <Link to="/login">Se connecter</Link>
                        </Card.Text>

                        <div className="d-grid">
                            <Button variant="primary" type="submit">
                                S'inscrire
                            </Button>
                        </div>
                    </Form>
                </Card>
            </div>
        </div>
    );
};

export default Register;
