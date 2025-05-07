import axios from 'axios';
import React, { useState, useEffect } from 'react';
import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button'
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";



function SuiviClientPage() {
    const [userList, setUserList] = useState([]);
    const [modifiedRows, setModifiedRows] = useState({});



    useEffect(() => {
        axios.get('http://localhost:5001/api/user')
            .then(response => {
                console.log(response.data)
                setUserList(response.data);
            })
            .catch(error => {
                console.error('Erreur lors de la récupération des données des utilisateurs :', error);
            });
    }, []);

    const balanceUpdate = (id, balance, extra_balance) => {
        axios.put(`http://localhost:5001/api/user/update/${id}`, {
            balance,
            extra_balance
        })
            .then(() => {
                alert("User mis à jour !");
            })
            .catch((error) => {
                console.error("Erreur lors de la mise à jour :", error);
            });
    };

    const handleInputChange = (index, field, value) => {
        const newUserList = [...userList];
        newUserList[index][field] = value;
        setUserList(newUserList);

        const userId = newUserList[index].id;
        setModifiedRows(prev => ({ ...prev, [userId]: true }));
    };



    return (
        <>
                <h1>Suivi client</h1>

                <Table striped bordered hover>
                    <thead>
                    <tr>
                        <th>Nom</th>
                        <th>Prénom</th>
                        <th>Mail</th>
                        <th>Abonement</th>
                        <th>Balance</th>
                        <th>Balance Extras</th>
                        <th></th>
                    </tr>
                    </thead>
                    <tbody>
                    {userList.map((item, index) => (
                        <tr>
                            <td>{item.first_name}</td>
                            <td>{item.last_name}</td>
                            <td>{item.email}</td>
                            <td>{item.subscriptions_id}</td>
                            <td>
                                <div className="d-flex align-items-center">
                                    <input
                                        type="number"
                                        className="form-control bg-white text-dark "
                                        style={{ width: "11ch" }}
                                        value={item.balance}
                                        onChange={(e) => handleInputChange(index, "balance", e.target.value)}

                                    />
                                    <span>€</span>
                                </div>
                            </td>
                            <td>
                                <div className="d-flex align-items-center">
                                    <input
                                        type="number"
                                        className="form-control bg-white text-dark"
                                        style={{ width: "11ch" }}
                                        value={item.extra_balance}
                                        onChange={(e) => handleInputChange(index, "extra_balance", e.target.value)}

                                    />
                                    <span>€</span>
                                </div>
                            </td>
                            <td>
                                <Button
                                    variant={modifiedRows[item.id] ? "warning" : "success"}
                                    className="me-2"
                                    onClick={() => {
                                        balanceUpdate(item.id, item.balance, item.extra_balance);

                                        // Réinitialise la couleur
                                        setModifiedRows(prev => {
                                            const newState = { ...prev };
                                            delete newState[item.id];
                                            return newState;
                                        });
                                    }}
                                >
                                    <i className="bi bi-pencil-square"></i>
                                </Button>

                                <Button variant="danger" className="me-2">
                                    <i className="bi bi-trash-fill"></i>
                                </Button>
                                <Button variant="primary" className="me-2">
                                    <i className="bi bi-envelope-arrow-up"></i>
                                </Button>

                            </td>
                        </tr>
                    ))}
                    </tbody>
                </Table>
        </>
    );
}

export default SuiviClientPage;