import "./main.scss";
import API, { BASE_URL } from "../../../../api.jsx";
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

export default function Listing() {
    const { id } = useParams();
    const [clothingInfo, setClothingInfo] = useState(null);
    const [tags, setTags] = useState([]);
    const [newTag, setNewTag] = useState("");
    const [newName, setNewName] = useState("");
    const [newUserId, setNewUserId] = useState("");
    const [error, setError] = useState(null);
    const [showPopup, setShowPopup] = useState(false);
    const [popupMessage, setPopupMessage] = useState("");
    const [popupError, setPopupError] = useState(false);

    const [showNamePopup, setShowNamePopup] = useState(false);
    const [showUserIdPopup, setShowUserIdPopup] = useState(false);

    const [showImagePopup, setShowImagePopup] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null);

    const [availableTags, setAvailableTags] = useState([]);
    const [saving, setSaving] = useState(false);

    // Fetch product details
    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch product details (including current tags)
                const productResponse = await API.get(`/products/listing/${id}`);
                setClothingInfo(productResponse.data);
                setTags(productResponse.data.tags || []); // Current tags
    
                // Fetch add-able tags
                const tagsResponse = await API.get("/tags");
                const availableTags = tagsResponse.data
                    .map((tag) => tag.name) // Extract tag names
                    .filter((tagName) => !(productResponse.data.tags || []).includes(tagName)); // Exclude current tags
                setAvailableTags(availableTags);
            } catch (err) {
                console.error("Error fetching data:", err);
                setError("Failed to load product or tags.");
            }
        };
    
        fetchData();
    }, [id]);

    const handleUpdateName = async () => {
        try {
            await API.post(`/products/update/${id}`, { name: newName });
            setClothingInfo((prev) => ({ ...prev, name: newName }));
            setShowNamePopup(false);
            setPopupMessage("Name updated successfully!");
            setPopupError(false);
            setShowPopup(true);
        } catch (err) {
            console.error("Error updating name:", err);
            setPopupMessage("Failed to update name.");
            setPopupError(true);
            setShowPopup(true);
        }
    };

    const handleUpdateUserId = async () => {
        try {
            await API.post(`/products/update/${id}`, { customer_id: newUserId });
            setClothingInfo((prev) => ({ ...prev, username: `User ID: ${newUserId}` }));
            setShowUserIdPopup(false);
            setPopupMessage("User ID updated successfully!");
            setPopupError(false);
            setShowPopup(true);
        } catch (err) {
            console.error("Error updating user ID:", err);
            setPopupMessage("Failed to update user ID.");
            setPopupError(true);
            setShowPopup(true);
        }
    };

    const handleAddTag = async () => {
        if (newTag && !tags.includes(newTag)) {
            const updatedTags = [...tags, newTag];
            setTags(updatedTags); // Update current tags
    
            // Update add-able tags dropdown
            setAvailableTags((prev) => prev.filter((tag) => tag !== newTag));
    
            try {
                await API.post(`/products/update/${id}`, { tags: updatedTags });
                alert("Tag added successfully!");
            } catch (err) {
                console.error("Error adding tag:", err);
                alert("Failed to add tag.");
            }
    
            setNewTag(""); // Clear input field
        }
    };

    const handleRemoveTag = async (tagToRemove) => {
        const updatedTags = tags.filter((tag) => tag !== tagToRemove);
        setTags(updatedTags); // Update current tags
    
        // Add back to available tags
        setAvailableTags((prev) => [...prev, tagToRemove]);
    
        try {
            await API.post(`/products/update/${id}`, { tags: updatedTags });
            alert("Tag removed successfully!");
        } catch (err) {
            console.error("Error removing tag:", err);
            alert("Failed to remove tag.");
        }
    };

    const handleDeleteProduct = async () => {
        const confirmDelete = window.confirm("Are you sure you want to delete this product?");
        if (!confirmDelete) return;
    
        try {
            const response = await API.delete(`/products/delete/${id}`);
            alert(response.data.message || "Product deleted successfully!");
            // Redirect to a different page or update the UI
            window.location.href = "/clothing"; // Example: Redirect to the product listing page
        } catch (err) {
            console.error("Error deleting product:", err);
            alert("Failed to delete product.");
        }
    };

    const handleUpdateImage = async () => {
        if (!selectedImage) {
            alert("Please select an image.");
            return;
        }
    
        try {
            const formData = new FormData();
            formData.append("image", selectedImage);
    
            const response = await API.post(`/products/update/${id}`, formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            alert(response.data.message || "Image updated successfully!");
    
            // Update the product image in the UI
            setClothingInfo((prev) => ({
                ...prev,
                img_url: response.data.image_url, // Update img_url from the response
            }));
            setShowImagePopup(false);
        } catch (err) {
            console.error("Error updating image:", err);
            alert("Failed to update image.");
        }
    };

    const handleSaveTags = async () => {
        try {
            const response = await API.post(`/products/update/${id}`, { tags });
            alert(response.data.message || "Tags updated successfully!");
        } catch (err) {
            console.error("Error saving tags:", err);
            alert("Failed to save tags.");
        }
    };

    if (!clothingInfo) return <p>{error || "Loading..."}</p>;

    return (
        <>
            <div className="padding-25"></div>
            <div className="listing">
                <div className="header">
                    <div className="pfp-section">
                    <div className="image-section">
                        <img
                            src={`${BASE_URL}${clothingInfo.img_url}`}
                            alt={clothingInfo?.name || "Product Image"}
                            crossOrigin="anonymous"
                            onClick={() => setShowImagePopup(true)}
                        />
                    </div>
                    </div>
                    <h1 className="name">
                        {clothingInfo.name}{" "}
                        <span className="edit" onClick={() => setShowNamePopup(true)}>
                            ✎
                        </span>
                    </h1>
                    <p className="owner-username">
                        Owned by: {clothingInfo.username}{" "}
                        <span className="edit" onClick={() => setShowUserIdPopup(true)}>
                            ✎
                        </span>
                    </p>
                </div>

                {/* Tags Section */}
                <div className="tags-section">
                    <h2>Tags</h2>
                    <div className="tags">
                        {tags.map((tag, index) => (
                            <div key={index} className="tag">
                                {tag}
                                <button className="remove-tag" onClick={() => handleRemoveTag(tag)}>
                                    ✕
                                </button>
                            </div>
                        ))}
                    </div>
                    <div className="add-tag">
                        <select value={newTag} onChange={(e) => setNewTag(e.target.value)}>
                            <option value="">Select a tag</option>
                            {availableTags.map((tag, index) => (
                                <option key={index} value={tag}>
                                    {tag}
                                </option>
                            ))}
                        </select>
                        <button onClick={handleAddTag}>Add Tag</button>
                    </div>
                </div>

                <div className="save-section">
                    <button className="delete-button" onClick={handleDeleteProduct}>
                        Delete Product
                    </button>
                    <p className="feedback-message">{popupMessage}</p>
                </div>

                {/* Popups */}
                {showPopup && (
                    <div className="popup">
                        <div className="popup-content">
                            <p className={popupError ? "popup-error" : "popup-success"}>
                                {popupMessage}
                            </p>
                            <button onClick={() => setShowPopup(false)}>Close</button>
                        </div>
                    </div>
                )}

                {showNamePopup && (
                    <div className="popup">
                        <div className="popup-content">
                            <h2>Update Name</h2>
                            <input
                                type="text"
                                value={newName}
                                onChange={(e) => setNewName(e.target.value)}
                            />
                            <div className="popup-buttons">
                                <button onClick={handleUpdateName}>Save</button>
                                <button onClick={() => setShowNamePopup(false)}>Cancel</button>
                            </div>
                        </div>
                    </div>
                )}

                {showUserIdPopup && (
                    <div className="popup">
                        <div className="popup-content">
                            <h2>Update User ID</h2>
                            <input
                                type="text"
                                value={newUserId}
                                onChange={(e) => setNewUserId(e.target.value)}
                            />
                            <div className="popup-buttons">
                                <button onClick={handleUpdateUserId}>Save</button>
                                <button onClick={() => setShowUserIdPopup(false)}>Cancel</button>
                            </div>
                        </div>
                    </div>
                )}

                {showImagePopup && (
                    <div className="popup">
                        <div className="popup-content">
                            <h2>Update Product Image</h2>
                            <input type="file" onChange={(e) => setSelectedImage(e.target.files[0])} />
                            <div className="popup-buttons">
                                <button onClick={handleUpdateImage}>Upload</button>
                                <button onClick={() => setShowImagePopup(false)}>Cancel</button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}