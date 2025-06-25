import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Form from "react-bootstrap/Form";
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import CardHeader from 'react-bootstrap/CardHeader'
import CardTitle from 'react-bootstrap/CardTitle'
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
            const res = await api.post('/auth/login', {
                email,
                password
            });
            setMsg('Connecté !');
            navigate('/');
            window.location.reload();
        } catch (err) {
            setMsg(err.response?.data?.error || 'Erreur');
        }
    };

    return (
        <Card style={{ width: '50%' }} className="mx-auto">
            <Card.Body>
                <CardTitle>
                    <h2>Se connecter</h2>
                </CardTitle>
                <Form onSubmit={handleLogin}>

                    <Form.Group className="mb-3" controlId="formBasicEmail">
                        <Form.Label>Email</Form.Label>
                        <Form.Control type="email" placeholder="Enter email" onChange={e => setEmail(e.target.value)} style={{ width: '60%' }} required />
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="formBasicPassword">
                        <Form.Label>Mot de passe</Form.Label>
                        <Form.Control type="password" placeholder="Password" onChange={e => setPassword(e.target.value)} style={{ width: '60%' }} required />
                    </Form.Group>
                    <Card.Text>
                        Vous n'avez pas encore de compte ? <Link to="/register">S'inscrire</Link>
                    </Card.Text>
                    <Button variant="primary" type="submit">
                        Se connecter
                    </Button>
                </Form>
            </Card.Body>
        </Card>


    );
};

export default Login;
