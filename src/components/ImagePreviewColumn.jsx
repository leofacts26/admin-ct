import React, { useState } from "react";
import { Modal, Button } from "react-bootstrap";
import { FaCloudUploadAlt, FaDownload } from "react-icons/fa";

const ImagePreviewColumn = ({ row, dispatch, setCuisineId, onUploadCityImage, handleImageError }) => {
  const [showImagePreview, setShowImagePreview] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  const handleImageClick = (image) => {
    setSelectedImage(image);
    setShowImagePreview(true);
  };

  const handleClosePreview = () => {
    setShowImagePreview(false);
    setSelectedImage(null);
  };

  return (
    <>
      <div>
        {row.image ? (
          <>
            <input
              accept="image/*"
              id={`onUploadCityImage-${row.id}`}
              multiple
              type="file"
              style={{ display: "none" }}
              onChange={(e) => onUploadCityImage(e)}
            />
            <label htmlFor={`onUploadCityImage-${row.id}`}>
              <span
                style={{ cursor: "pointer" }}
                onClick={() => dispatch(setCuisineId(row?.id))}
              >
                <img
                  onError={handleImageError}
                  src={row?.image}
                  style={{ width: "30px", borderRadius: "5px" }}
                  alt=""
                  className="img-fluid"
                  onClick={(e) => {
                    e.preventDefault(); // Prevent default behavior
                    handleImageClick(row.image); // Open the preview modal
                  }}
                />
              </span>
            </label>
          </>
        ) : (
          <>
            <input
              accept="image/*"
              id={`onUploadCityImage-${row.id}`}
              multiple
              type="file"
              style={{ display: "none" }}
              onChange={(e) => onUploadCityImage(e)}
            />
            <label htmlFor={`onUploadCityImage-${row.id}`}>
              <span
                style={{ cursor: "pointer" }}
                onClick={() => dispatch(setCuisineId(row?.id))}
              >
                <FaCloudUploadAlt size={30} />
              </span>
            </label>
          </>
        )}
      </div>

      {/* Image Preview Modal */}
      <Modal show={showImagePreview} onHide={handleClosePreview} centered size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Image Preview</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedImage && (
            <div className="text-center">
              <img
                src={selectedImage}
                alt="Preview"
                className="img-fluid"
                style={{ maxHeight: "auto", width: '100%', borderRadius: "5px" }}
              />
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          {selectedImage && (
            <>
              {/* Download Button */}
              <Button
                variant="primary"
                href={selectedImage}
                target="_blank" // Open in a new tab
                rel="noopener noreferrer" // Ensure safe linking
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <FaDownload style={{ marginRight: "8px" }} />
                Download 
              </Button>
            </>
          )}
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default ImagePreviewColumn;
