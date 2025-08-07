import React, { useState } from "react";
import axios from "axios";
import Card from "react-bootstrap/Card";
import CardTitle from "react-bootstrap/CardTitle";
import Form from "react-bootstrap/Form";
import {Link} from "react-router-dom";
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

        <Card style={{ width: '50%' }} className="mx-auto">
            <Card.Body>
                <CardTitle>
                    <h2>S'inscrire</h2>
                </CardTitle>
                <Form onSubmit={handleSubmit}>

                    <Form.Group controlId="formBasicName">
                        <Form.Label>Prénom:</Form.Label>
                        <Form.Control name="first_name" type="lastname" placeholder="Prénom" onChange={handleChange} value={formData.first_name} style={{ width: '40%' }} required />
                    </Form.Group>

                    <Form.Group controlId="formBasicName">
                        <Form.Label>Nom:</Form.Label>
                        <Form.Control name="last_name" type="name" placeholder="Nom" onChange={handleChange} value={formData.last_name} style={{ width: '40%' }} required />
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="formBasicEmail">
                        <Form.Label>Email:</Form.Label>
                        <Form.Control name="email" type="email" placeholder="Entrer mail" onChange={handleChange} value={formData.email} style={{ width: '60%' }} required />
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="formBasicPassword">
                        <Form.Label>Mot de passe:</Form.Label>
                        <Form.Control name="password" type="password" placeholder="Mot de passe" onChange={handleChange} value={formData.password} style={{ width: '60%' }} required />
                    </Form.Group>
                    <Card.Text>
                        Vous avez déjà un compte ? <Link to="/login">Se connecter</Link>
                    </Card.Text>
                    <Button variant="primary" type="submit">
                        Se connecter
                    </Button>
                </Form>
            </Card.Body>
        </Card>


    );
};

export default Register;
