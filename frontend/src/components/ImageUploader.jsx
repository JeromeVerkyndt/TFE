import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Row, Col, Button, Image, Alert } from 'react-bootstrap';

function ImageUploader({ onChange }) {
    const [files, setFiles] = useState([]);
    const [error, setError] = useState(null);

    const onDrop = useCallback((acceptedFiles) => {
        const newFiles = acceptedFiles.map(file =>
            Object.assign(file, {
                preview: URL.createObjectURL(file),
            })
        );

        const updatedFiles = [...files, ...newFiles];

        if (updatedFiles.length > 5) {
            setError("Maximum 5 images autorisées.");
            return;
        }

        setFiles(updatedFiles);
        setError(null);
        onChange(updatedFiles);
    }, [files, onChange]);

    const removeFile = (index) => {
        const newFiles = [...files];
        newFiles.splice(index, 1);
        setFiles(newFiles);
        onChange(newFiles);
    };

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        accept: {
            'image/*': []
        },
        onDrop,
        multiple: true
    });

    return (
        <div>
            {error && <Alert variant="danger">{error}</Alert>}

            <div
                {...getRootProps()}
                className="border border-secondary rounded p-4 text-center bg-light"
                style={{ cursor: 'pointer' }}
            >
                <input {...getInputProps()} />
                {
                    isDragActive
                        ? <p>Déposez les images ici...</p>
                        : <p>Glissez/déposez des images ici ou cliquez pour sélectionner (max 5)</p>
                }
            </div>

            <Row className="mt-3">
                {files.map((file, index) => (
                    <Col key={index} xs={4} className="mb-3 text-center">
                        <div className="position-relative">
                            <Image
                                src={file.preview}
                                thumbnail
                                style={{ height: '100px', objectFit: 'cover' }}
                            />
                            <Button
                                size="sm"
                                variant="danger"
                                onClick={() => removeFile(index)}
                                className="position-absolute top-0 end-0 rounded-circle"
                                style={{ transform: 'translate(50%, -50%)' }}
                            >
                                ×
                            </Button>
                        </div>
                    </Col>
                ))}
            </Row>
        </div>
    );
}

export default ImageUploader;
