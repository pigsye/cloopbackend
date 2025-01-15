import "./main.scss";
import API from "../../../../api.jsx";
import React, { useState, useEffect } from "react";

export default function Tags() {
    const [tags, setTags] = useState([]); // Store fetched tags
    const [newTag, setNewTag] = useState(""); // New tag to be created
    const [newDescription, setNewDescription] = useState(""); // New tag description
    const [showCreatePopup, setShowCreatePopup] = useState(false); // Toggle popup
    const [showEditPopup, setShowEditPopup] = useState(false); // Toggle edit popup
    const [editTagId, setEditTagId] = useState(null); // Tag being edited
    const [editTagName, setEditTagName] = useState(""); // Updated tag name
    const [editTagDescription, setEditTagDescription] = useState(""); // Updated tag description
    const [error, setError] = useState(null); // Error handling

    // Fetch tags from the backend
    useEffect(() => {
        const fetchTags = async () => {
            try {
                const response = await API.get("/tags");
                setTags(response.data); // Expecting tags with `id`, `name`, and `description`
            } catch (err) {
                console.error("Error fetching tags:", err);
            }
        };
    
        fetchTags();
    }, []);

    // Handle creating a new tag
    const handleCreateTag = async () => {
        if (!newTag.trim() || !newDescription.trim()) {
            alert("Both tag name and description are required.");
            return;
        }
    
        try {
            const response = await API.post("/tags/create", {
                name: newTag.trim(),
                description: newDescription.trim(),
            });
    
            setTags((prev) => [...prev, response.data.tag]); // Add the newly created tag
            alert("Tag created successfully!");
            setNewTag("");
            setNewDescription("");
            setShowCreatePopup(false);
        } catch (err) {
            console.error("Error creating tag:", err);
            alert("Failed to create tag. Please try again.");
        }
    };

    // Handle editing a tag
    const handleEditTag = async () => {
        try {
            await API.post("/tags/update", {
                id: editTagId,
                name: editTagName,
                description: editTagDescription,
            });
            setTags((prev) =>
                prev.map((tag) =>
                    tag.id === editTagId
                        ? { ...tag, name: editTagName, description: editTagDescription }
                        : tag
                )
            );
            alert("Tag updated successfully!");
            setShowEditPopup(false);
        } catch (err) {
            console.error("Error editing tag:", err);
            alert("Failed to update tag. Please try again.");
        }
    };

    // Handle deleting a tag
    const handleDeleteTag = async (tagName) => {
        const confirmDelete = window.confirm(`Are you sure you want to delete the tag "${tagName}"?`);
        if (!confirmDelete) return;

        try {
            await API.post("/tags/delete", { name: tagName }); // API call to delete the tag
            setTags((prev) => prev.filter((tag) => tag.name !== tagName)); // Update the UI
            alert("Tag deleted successfully!");
        } catch (err) {
            console.error("Error deleting tag:", err);
            alert("Failed to delete tag. Please try again.");
        }
    };

    return (
        <div className="tags">
            <div className="actionbar">
                <p className="tags">Tags</p>
                <button className="create-tags" onClick={() => setShowCreatePopup(true)}>
                    Create Tag
                </button>
            </div>
            {error && <p className="error-message">{error}</p>}
            <div className="tagss">
                {tags.length > 0 ? (
                    tags.map((tag) => (
                        <div key={tag.id} className="tag">
                            <div className="infobox">
                                <h1 className="name">{tag.name}</h1>
                                <p className="description">{tag.description}</p>
                            </div>
                            <div className="actions">
                                <p
                                    className="edit"
                                    onClick={() => {
                                        setEditTagId(tag.id);
                                        setEditTagName(tag.name);
                                        setEditTagDescription(tag.description);
                                        setShowEditPopup(true);
                                    }}
                                >
                                    Edit
                                </p>
                                <p className="delete" onClick={() => handleDeleteTag(tag.name)}>
                                    Delete
                                </p>
                            </div>
                        </div>
                    ))
                ) : (
                    <p>No tags found.</p>
                )}
            </div>

            {/* Create Tag Popup */}
            {showCreatePopup && (
                <div className="popup">
                    <div className="popup-content">
                        <h2>Create New Tag</h2>
                        <input
                            type="text"
                            value={newTag}
                            onChange={(e) => setNewTag(e.target.value)}
                            placeholder="Enter tag name"
                        />
                        <textarea
                            value={newDescription}
                            onChange={(e) => setNewDescription(e.target.value)}
                            placeholder="Enter tag description"
                        />
                        <div className="popup-buttons">
                            <button onClick={handleCreateTag}>Create</button>
                            <button onClick={() => setShowCreatePopup(false)}>Cancel</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Edit Tag Popup */}
            {showEditPopup && (
                <div className="popup">
                    <div className="popup-content">
                        <h2>Edit Tag</h2>
                        <input
                            type="text"
                            value={editTagName}
                            onChange={(e) => setEditTagName(e.target.value)}
                            placeholder="Edit tag name"
                        />
                        <textarea
                            value={editTagDescription}
                            onChange={(e) => setEditTagDescription(e.target.value)}
                            placeholder="Edit tag description"
                        />
                        <div className="popup-buttons">
                            <button onClick={handleEditTag}>Save</button>
                            <button onClick={() => setShowEditPopup(false)}>Cancel</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}