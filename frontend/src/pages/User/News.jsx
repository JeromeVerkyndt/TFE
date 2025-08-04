import React, { useEffect, useState } from 'react';
import Card from 'react-bootstrap/Card';
import Spinner from 'react-bootstrap/Spinner';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import api from '../../api';

function NewsPage() {
    const [news, setNews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [galleryImages, setGalleryImages] = useState([]);
    const [showGallery, setShowGallery] = useState(false);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);


    useEffect(() => {
        api.get('/news')
            .then(res => {
                // Trie les news par date recent -> ancien
                const sortedNews = res.data.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
                setNews(sortedNews);
                setLoading(false);
            })
            .catch(err => {
                console.error('Erreur de chargement :', err);
                setError("Erreur lors du chargement des news");
                setLoading(false);
            });
    }, []);

    if (loading) {
        return <div className="text-center mt-5"><Spinner animation="border" /></div>;
    }

    if (error) {
        return <div className="text-danger text-center mt-5">{error}</div>;
    }

    return (
        <Container className="mt-4">
            {news.map(item => (
                <Card key={item.id} className="mb-4 shadow-sm">
                    <Card.Body>
                        <div className="d-flex justify-content-between align-items-start">
                            <Card.Title style={{fontSize: '1.5rem', fontWeight: 'bold'}}>{item.title}</Card.Title>
                            <small className="text-muted">{new Date(item.created_at).toLocaleDateString()}</small>
                        </div>

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

                        <Card.Text>{item.text}</Card.Text>
                    </Card.Body>
                </Card>
            ))}
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


        </Container>
    );
}

export default NewsPage;
