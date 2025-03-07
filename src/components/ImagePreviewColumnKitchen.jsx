import React, { useState } from "react";
import { Modal, Button, Stack } from "react-bootstrap";
import { FaCloudUploadAlt, FaDownload } from "react-icons/fa";

const ImagePreviewColumnKitchen = ({ row, dispatch, setKitchenId, onUploadKitchenImage, handleImageError }) => {
  const [showImagePreview, setShowImagePreview] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  // console.log(row, "rowrowrowrowrowrow");
  // console.log(setKitchenId, "setKitchenIdsetKitchenIdsetKitchenId");
  

  const handleImageClick = (image) => {
    setSelectedImage(image);
    setShowImagePreview(true);
  };

  const handleClosePreview = () => {
    setShowImagePreview(false);
    setSelectedImage(null);
  };

  console.log(row, "row")

  return (
    <>
      <div>
        {row.image ? (
          <>
            <input
              accept="image/*"
              id={`onUploadKitchenImage-${row.id}`}
              multiple
              type="file"
              style={{ display: "none" }}
              onChange={(e) => onUploadKitchenImage(e)}
            />
            <label htmlFor={`onUploadKitchenImage-${row.id}`}>
              <span
                style={{ cursor: "pointer" }}
                onClick={() => dispatch(setKitchenId(row?.id))}
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
              id={`onUploadKitchenImage-${row.id}`}
              multiple
              type="file"
              style={{ display: "none" }}
              onChange={(e) => onUploadKitchenImage(e)}
            />
            <label htmlFor={`onUploadKitchenImage-${row.id}`}>
              <span
                style={{ cursor: "pointer" }}
                onClick={() => dispatch(setKitchenId(row?.id))}
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

              <div style={{
                width: '100%',
                display: 'flex',
                justifyContent: "space-between",
                alignItems: "center",
              }}>
                <div>
                  <input
                    accept="image/*"
                    id={`onUploadKitchenImage-${row.id}`}
                    multiple
                    type="file"
                    style={{ display: "none" }}
                    onChange={(e) => onUploadKitchenImage(e)}
                  />
                  <label htmlFor={`onUploadKitchenImage-${row.id}`}>
                    <h4
                      style={{ cursor: "pointer" }}
                      onClick={() => dispatch(setKitchenId(row?.id))}
                    >
                      ReUpload   <FaCloudUploadAlt size={30} style={{ marginLeft: '10px' }} />
                    </h4>
                  </label>
                </div>

                <div>
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
                </div>
              </div>




            </>
          )}
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default ImagePreviewColumnKitchen;
