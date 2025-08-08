import React, { useEffect, useState } from "react";
import { Container, Row, Col, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import api from '../../api.js';



function UsersSelectePage() {
    const [users, setUsers] = useState([]);

    const navigate = useNavigate();

    const handleSelectUser = (user) => {
        navigate("/hub/panier", { state: { client: user } });
    };


    useEffect(() => {
        api.get("/user/clients")
            .then(response => {
                setUsers(response.data);
            })
            .catch(error => {
                console.error("Erreur lors du chargement des clients :", error);
            });
    }, []);



    const rows = [];
    for (let i = 0; i < users.length; i += 5) {
        rows.push(users.slice(i, i + 5));
    }

    return (
        <Container className="mt-4 text-center">
            <h1 className="mb-4">Quel mangeur êtes-vous ?</h1>
            <Row className="d-flex flex-wrap justify-content-center">
                {users.map((user) => (
                    <div
                        key={user.id}
                        style={{
                            width: "20%",
                            padding: "10px",
                            boxSizing: "border-box",
                        }}
                    >
                        <Button
                            variant="success"
                            className="w-100"
                            style={{
                                height: "60px",
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'center',
                                alignItems: 'center',
                                textAlign: 'center',
                                padding: 0,
                            }}
                            onClick={() => handleSelectUser(user)}
                        >
                            <div style={{ lineHeight: 1 }}>{user.last_name}</div>
                            <div style={{ lineHeight: 1 }}>{user.first_name}</div>
                        </Button>


                    </div>
                ))}
            </Row>
        </Container>
    );
}

export default UsersSelectePage;
