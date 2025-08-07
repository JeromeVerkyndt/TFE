import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Form from "react-bootstrap/Form";
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import CardTitle from 'react-bootstrap/CardTitle';
import { Link } from 'react-router-dom';
import api from '../api.js';

axios.defaults.withCredentials = true;

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [msg, setMsg] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setMsg('');
        try {
            const res = await api.post('/auth/login', { email, password });
            setMsg('Connecté !');
            navigate('/');
            window.location.reload();
        } catch (err) {
            setMsg(err.response?.data?.error || 'Erreur');
        }
    };

    return (
        <div className="container d-flex justify-content-center align-items-start min-vh-100 pt-5">
            <div className="col-12 col-sm-10 col-md-8 col-lg-6">
                <Card className="p-4 shadow">
                    <CardTitle className="mb-3 text-center">
                        <h2>Se connecter</h2>
                    </CardTitle>

                    <Form onSubmit={handleLogin}>
                        <Form.Group className="mb-3" controlId="formBasicEmail">
                            <Form.Label>Email</Form.Label>
                            <Form.Control
                                type="email"
                                placeholder="Entrez votre email"
                                onChange={e => setEmail(e.target.value)}
                                required
                            />
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="formBasicPassword">
                            <Form.Label>Mot de passe</Form.Label>
                            <Form.Control
                                type="password"
                                placeholder="Mot de passe"
                                onChange={e => setPassword(e.target.value)}
                                required
                            />
                        </Form.Group>

                        <Card.Text className="mb-3">
                            Vous n'avez pas encore de compte ? <Link to="/register">S'inscrire</Link>
                        </Card.Text>

                        <div className="d-grid">
                            <Button variant="primary" type="submit">
                                Se connecter
                            </Button>
                        </div>

                        {msg && <p className="mt-3 text-danger text-center">{msg}</p>}
                    </Form>
                </Card>
            </div>
        </div>
    );
};

export default Login;
