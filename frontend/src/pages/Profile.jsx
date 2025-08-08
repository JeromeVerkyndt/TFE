import React, { useState } from "react";
import useAuth from "../hooks/useAuth.js";
import api from "../api.js";
import { Card, Form, Button, Alert, Spinner } from "react-bootstrap";

function ProfilePage() {
    const { user, loading } = useAuth();
    const [email, setEmail] = useState(user?.email || "");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const [message, setMessage] = useState(null);
    const [error, setError] = useState(null);
    const [updating, setUpdating] = useState(false);

    if (loading) {
        return (
            <div className="d-flex justify-content-center align-items-center" style={{ height: "80vh" }}>
                <Spinner animation="border" />
            </div>
        );
    }

    if (!user) {
        return (
            <div className="container mt-4">
                <Alert variant="danger">Vous devez être connecté pour voir cette page.</Alert>
            </div>
        );
    }

    const handleUpdateEmail = (e) => {
        e.preventDefault();
        setError(null);
        setMessage(null);

        setUpdating(true);
        api.put(`/user/${user.id}/email`, { email })
            .then(() => {
                setMessage("Email mis à jour avec succès !");
            })
            .catch(() => {
                setError("Erreur lors de la mise à jour de l'email.");
            })
            .finally(() => setUpdating(false));
    };

    const handlePasswordChange = (e) => {
        e.preventDefault();
        setError(null);
        setMessage(null);

        if (newPassword !== confirmPassword) {
            setError("Les mots de passe ne correspondent pas.");
            return;
        }

        setUpdating(true);
        api.put(`/auth/change-password`, { newPassword })
            .then(() => {
                setMessage("Mot de passe mis à jour avec succès !");
                setNewPassword("");
                setConfirmPassword("");
            })
            .catch(() => {
                setError("Erreur lors de la mise à jour du mot de passe.");
            })
            .finally(() => setUpdating(false));
    };

    return (
        <div className="container mt-5 d-flex justify-content-center">
            <Card style={{ width: "40rem" }} className="shadow-lg p-4 rounded-4">
                <div className="text-center mb-4">
                    <img
                        src={`https://ui-avatars.com/api/?name=${user.first_name}+${user.last_name}&background=random`}
                        alt="Avatar"
                        className="rounded-circle mb-3"
                        style={{ width: "100px", height: "100px" }}
                    />
                    <h3>{user.first_name} {user.last_name}</h3>
                    <h4>{user.email}</h4>
                    <span className="badge bg-secondary">{user.role}</span>
                </div>

                {error && <Alert variant="danger">{error}</Alert>}
                {message && <Alert variant="success">{message}</Alert>}

                {/* Formulaire changement email */}
                <Form onSubmit={handleUpdateEmail} className="mb-4">
                    <Form.Group className="mb-3" controlId="email">
                        <Form.Label>Nouveau mail</Form.Label>
                        <Form.Control
                            type="email"
                            value={user.email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </Form.Group>
                    <Button type="submit" variant="primary" className="w-100" disabled={updating}>
                        {updating ? <Spinner animation="border" size="sm" /> : "Mettre à jour l'email"}
                    </Button>
                </Form>

                <hr />

                {/* Formulaire changement mot de passe */}
                <Form onSubmit={handlePasswordChange}>
                    <Form.Group className="mb-3" controlId="newPassword">
                        <Form.Label>Nouveau mot de passe</Form.Label>
                        <Form.Control
                            type="password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            required
                        />
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="confirmPassword">
                        <Form.Label>Confirmer le mot de passe</Form.Label>
                        <Form.Control
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                        />
                    </Form.Group>

                    <Button type="submit" variant="primary" className="w-100" disabled={updating}>
                        {updating ? <Spinner animation="border" size="sm" /> : "Mettre à jour le mot de passe"}
                    </Button>
                </Form>
            </Card>
        </div>
    );
}

export default ProfilePage;
