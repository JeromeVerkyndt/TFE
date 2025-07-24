import React, { useState, useCallback } from 'react';
import { Modal, Button } from 'react-bootstrap';
import Cropper from 'react-easy-crop';
import getCroppedImg from './cropImage.js';

const ImageCropperModal = ({ show, imageSrc, onClose, onCropConfirm }) => {
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

    const onCropComplete = useCallback((_, croppedAreaPixels) => {
        setCroppedAreaPixels(croppedAreaPixels);
    }, []);

    const handleConfirm = async () => {
        const croppedBlob = await getCroppedImg(imageSrc, croppedAreaPixels);
        onCropConfirm(croppedBlob);
        onClose();
    };

    return (
        <Modal show={show} onHide={onClose} centered size="lg">
            <Modal.Header closeButton>
                <Modal.Title>Recadrer l’image</Modal.Title>
            </Modal.Header>
            <Modal.Body style={{ height: 400, position: 'relative' }}>
                <Cropper
                    image={imageSrc}
                    crop={crop}
                    zoom={zoom}
                    aspect={1}
                    onCropChange={setCrop}
                    onZoomChange={setZoom}
                    onCropComplete={onCropComplete}
                />
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={onClose}>Annuler</Button>
                <Button variant="primary" onClick={handleConfirm}>Recadrer</Button>
            </Modal.Footer>
        </Modal>
    );
};

export default ImageCropperModal;
