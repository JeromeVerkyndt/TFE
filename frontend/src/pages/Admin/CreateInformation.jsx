import axios from 'axios';
import React, { useState, useEffect } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import Accordion from 'react-bootstrap/Accordion';



function CreateInformationPage() {
    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const [news, setNews] = useState([]);
    const [error, setError] = useState(null);

    const [title, setTitle] = useState('');
    const [text, setText] = useState('');
    const [message, setMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post('http://localhost:5001/api/news', {
                title,
                text,
            });
            setMessage(res.data.message); // "News ajouté"
            setTitle('');
            setText('');
        } catch (error) {
            console.error('Erreur lors de l\'ajout de la news :', error);
            setMessage("Erreur lors de l'envoi");
        }
    };


    useEffect(() => {
        axios.get('http://localhost:5001/api/news') // remplace l'URL selon ton backend
            .then(response => {
                setNews(response.data);
            })
            .catch(error => {
                console.error('Erreur lors de la récupération des news :', error);
                setError('Impossible de charger les actualités');
            });
    }, []);

    return (
        <>
            <div className="row">
                <div className="d-flex justify-content-end mb-3">
                    <Button variant="success" onClick={handleShow}>
                        + News
                    </Button>
                </div>

                <Modal show={show} onHide={handleClose} size="lg" centered>
                    <Modal.Header closeButton>
                        <Modal.Title>Créer une news</Modal.Title>
                    </Modal.Header>

                    <Modal.Body>
                        <Form id="newsForm" onSubmit={handleSubmit}>
                            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                                <Form.Label>Titre</Form.Label>
                                <Form.Control
                                    type="text"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    autoFocus
                                    required
                                />
                            </Form.Group>

                            <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
                                <Form.Label>Texte</Form.Label>
                                <Form.Control
                                    as="textarea"
                                    rows={3}
                                    value={text}
                                    onChange={(e) => setText(e.target.value)}
                                    required
                                />
                            </Form.Group>
                        </Form>
                    </Modal.Body>

                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleClose}>
                            Quitter
                        </Button>
                        <Button variant="primary" onClick={() => document.getElementById('newsForm').requestSubmit()}>
                            Enregistrer
                        </Button>
                    </Modal.Footer>
                </Modal>
            </div>

            <div className="row">
                <Accordion defaultActiveKey="0">
                    {news.map((item) => (
                        <Accordion.Item eventKey={item.id}>
                            <Accordion.Header>{item.title}</Accordion.Header>
                            <Accordion.Body>
                                {item.text}
                            </Accordion.Body>
                        </Accordion.Item>
                    ))}
                </Accordion>
            </div>
        </>
    );
}

export default CreateInformationPage;