import React, { useEffect, useState } from "react";
import { Container, Row, Col, Button } from "react-bootstrap";


function UsersSelectePage() {
    const [users, setUsers] = useState([]);

    useEffect(() => {
        // Remplace ceci par ton appel API réel
        const fakeUsers = Array.from({ length: 17 }, (_, i) => ({
            id: i + 1,
            name: `User ${i + 1}`,
        }));
        setUsers(fakeUsers);
    }, []);

    const rows = [];
    for (let i = 0; i < users.length; i += 5) {
        rows.push(users.slice(i, i + 5));
    }

    return (
        <Container className="mt-4 text-center">
            <h1 className="mb-4">Liste des utilisateurs</h1>
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
                            style={{ height: "50px" }}
                        >
                            {user.name}
                        </Button>
                    </div>
                ))}
            </Row>
        </Container>
    );
}

export default UsersSelectePage;
