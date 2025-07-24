import React, { useState, useEffect } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import Accordion from 'react-bootstrap/Accordion';
import ImageCropper from "../../components/ImageCropper.jsx";
import api from '../../api.js';
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";




function CreateInformationPage() {
    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const [news, setNews] = useState([]);
    const [error, setError] = useState(null);

    const [title, setTitle] = useState('');
    const [text, setText] = useState('');
    const [message, setMessage] = useState('');

    const [image, setImage] = useState([]);
    const [images, setImages] = useState([]);
    const [cropQueue, setCropQueue] = useState([]);



    const [isSubmitting, setIsSubmitting] = useState(false);

    const [showCropper, setShowCropper] = useState(false);
    const [selectedImageSrc, setSelectedImageSrc] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);
    const [galleryImages, setGalleryImages] = useState([]);
    const [showGallery, setShowGallery] = useState(false);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    const handleFileChange = (e) => {
        const files = Array.from(e.target.files);

        if (files.length > 0) {
            setCropQueue(files);

            const reader = new FileReader();
            reader.onload = () => {
                setSelectedImageSrc(reader.result);
                setShowCropper(true);
            };
            reader.readAsDataURL(files[0]);
        }
    };



    const handleCropConfirm = (blob) => {
        setImages((prev) => [...prev, blob]);

        const remainingQueue = cropQueue.slice(1);
        setCropQueue(remainingQueue);

        if (remainingQueue.length > 0) {
            const reader = new FileReader();
            reader.onload = () => {
                setSelectedImageSrc(reader.result);
                setShowCropper(true);
            };
            reader.readAsDataURL(remainingQueue[0]);
        } else {
            setShowCropper(false);
            setSelectedImageSrc(null);
        }
    };



    const handleSubmit = async (e) => {
        e.preventDefault();
        if (isSubmitting) return;

        setIsSubmitting(true);

        try {
            let imageUrls = [];

            // upload et recup url
            if (images && images.length > 0) {
                for (const img of images) {
                    const imageData = new FormData();
                    imageData.append("image", img);
                    const uploadRes = await api.post("/upload", imageData);
                    if (uploadRes.data.imageUrl) {
                        imageUrls.push(uploadRes.data.imageUrl);
                    }
                }
            }

            const newsRes = await api.post('/news', { title, text });
            const newsId = newsRes.data.insertId;

            // lie l'image avec la news
            for (const url of imageUrls) {
                await api.post(`/news/image/${newsId}`, { imageUrl: url });
            }

            setMessage(newsRes.data.message);
            setTitle('');
            setText('');
            setImages([]);
            handleClose();

            const updatedNews = await api.get('/news');
            setNews(updatedNews.data);

        } catch (error) {
            console.error('Erreur lors de l\'ajout de la news :', error);
            setMessage("Erreur lors de l'envoi");
        }
        finally {
            setIsSubmitting(false);
        }
    };


    useEffect(() => {
        api.get('/news')
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

                            <Form.Group className="mb-3">
                                <Form.Label>Image de la news</Form.Label>
                                <Form.Control
                                    type="file"
                                    accept="image/*"
                                    multiple
                                    onChange={handleFileChange}
                                />

                                <div className="d-flex flex-wrap gap-2 mt-3">
                                    {images.map((img, index) => (
                                        <div key={index} className="position-relative">
                                            <img
                                                src={URL.createObjectURL(img)}
                                                alt={`Image ${index + 1}`}
                                                style={{ width: '100px', height: '100px', objectFit: 'cover', borderRadius: '8px' }}
                                            />
                                            <Button
                                                variant="danger"
                                                size="sm"
                                                style={{
                                                    position: 'absolute',
                                                    top: 0,
                                                    right: 0,
                                                    transform: 'translate(50%, -50%)',
                                                    borderRadius: '50%',
                                                    padding: '0.2rem 0.4rem'
                                                }}
                                                onClick={() =>
                                                    setImages((prev) => prev.filter((_, i) => i !== index))
                                                }
                                            >
                                                ×
                                            </Button>
                                        </div>
                                    ))}
                                </div>

                                {previewUrl && (
                                    <div className="mt-3 text-center">
                                        <img src={previewUrl} alt="Preview" style={{ maxWidth: '100%', maxHeight: 200 }} />
                                    </div>
                                )}
                            </Form.Group>

                            <ImageCropper
                                show={showCropper}
                                imageSrc={selectedImageSrc}
                                onClose={() => setShowCropper(false)}
                                onCropConfirm={handleCropConfirm}
                            />



                        </Form>
                    </Modal.Body>

                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleClose}>
                            Quitter
                        </Button>
                        <Button
                            variant="primary"
                            onClick={() => document.getElementById('newsForm').requestSubmit()}
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? (
                                <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                            ) : (
                                'Enregistrer'
                            )}
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

                                {item.images && item.images.length > 0 && (
                                    <Row className="mb-3 g-2">
                                        {item.images.slice(0, 4).map((imgUrl, index) => {
                                            const totalImages = item.images.length;
                                            let colSize = 12;

                                            if (totalImages === 1) colSize = 12;
                                            else if (totalImages === 2) colSize = 6;
                                            else if (totalImages === 3 || totalImages >= 4) colSize = 3;

                                            return (
                                                <Col xs={6} md={colSize} key={index} className="position-relative">
                                                    <img
                                                        src={imgUrl}
                                                        alt={`illustration ${index + 1}`}
                                                        className="img-fluid rounded"
                                                        style={{
                                                            height: '100%',
                                                            width: '100%',
                                                            objectFit: 'cover',
                                                            aspectRatio: '1/1',
                                                            cursor: 'pointer'
                                                        }}
                                                        onClick={() => {
                                                            setGalleryImages(item.images);
                                                            setCurrentImageIndex(index);
                                                            setShowGallery(true);
                                                        }}
                                                    />

                                                    {index === 3 && totalImages > 4 && (
                                                        <div
                                                            onClick={() => {
                                                                setGalleryImages(item.images);
                                                                setCurrentImageIndex(3);
                                                                setShowGallery(true);
                                                            }}
                                                            className="position-absolute top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center"
                                                            style={{
                                                                backgroundColor: 'rgba(0, 0, 0, 0.5)',
                                                                color: 'white',
                                                                fontSize: '1.5rem',
                                                                fontWeight: 'bold',
                                                                borderRadius: '0.375rem',
                                                                cursor: 'pointer',
                                                            }}
                                                        >
                                                            +{totalImages - 4}
                                                        </div>
                                                    )}
                                                </Col>
                                            );
                                        })}
                                    </Row>


                                )}
                            </Accordion.Body>
                        </Accordion.Item>
                    ))}
                </Accordion>
            </div>

            <Modal
                show={showGallery}
                onHide={() => setShowGallery(false)}
                centered
                size="lg"
                className="modal-fullscreen"
            >
                <Modal.Body className="d-flex justify-content-center align-items-center bg-dark position-relative p-0">
                    <Button
                        variant="light"
                        className="position-absolute top-0 end-0 m-2"
                        onClick={() => setShowGallery(false)}
                    >
                        ✕
                    </Button>

                    <Button
                        variant="dark"
                        className="position-absolute start-0 top-50 translate-middle-y"
                        onClick={() =>
                            setCurrentImageIndex((prev) =>
                                prev > 0 ? prev - 1 : galleryImages.length - 1
                            )
                        }
                        style={{ fontSize: '2rem', opacity: 0.8 }}
                    >
                        ‹
                    </Button>

                    <img
                        src={galleryImages[currentImageIndex]}
                        alt={`image ${currentImageIndex + 1}`}
                        className="img-fluid"
                        style={{ maxHeight: '90vh', maxWidth: '100%' }}
                    />

                    <Button
                        variant="dark"
                        className="position-absolute end-0 top-50 translate-middle-y"
                        onClick={() =>
                            setCurrentImageIndex((prev) =>
                                prev < galleryImages.length - 1 ? prev + 1 : 0
                            )
                        }
                        style={{ fontSize: '2rem', opacity: 0.8 }}
                    >
                        ›
                    </Button>
                </Modal.Body>
            </Modal>
        </>
    );
}

export default CreateInformationPage;