import "./main.scss";
import API from "../../../../api.jsx";
import React, { useState, useEffect } from "react";

export default function Approve() {
    const [submissions, setSubmissions] = useState([]);
    const [error, setError] = useState(null);
    const [feedbackMessage, setFeedbackMessage] = useState("");

    const [showEditPopup, setShowEditPopup] = useState(false);
    const [editSubmission, setEditSubmission] = useState(null);
    const [editClothingName, setEditClothingName] = useState("");
    const [editDescription, setEditDescription] = useState("");
    const [editCustomerId, setEditCustomerId] = useState("");

    // Fetch submissions from the backend
    useEffect(() => {
        const fetchSubmissions = async () => {
            try {
                const response = await API.get("/clothing/submissions");
                setSubmissions(response.data);
            } catch (err) {
                console.error("Error fetching submissions:", err);
                setError("Failed to fetch submissions. Please try again later.");
            }
        };

        fetchSubmissions();
    }, []);

    // Handle accept submission
    const handleAccept = async (submission) => {
        try {
            const payload = {
                id: submission.id,
                name: submission.clothing_name,
                customerId: submission.customerId,
                tags: [], // Tags can be empty initially
            };

            // Send the product to the products database
            await API.post("/clothing/add", payload);

            // Delete the submission after adding it to the products database
            await API.post("/clothing/deletesubmission", { id: submission.id });

            // Update UI
            setSubmissions((prev) => prev.filter((s) => s.id !== submission.id));
            setFeedbackMessage("Submission accepted and added to products!");
        } catch (err) {
            console.error("Error accepting submission:", err);
            setFeedbackMessage("Failed to accept submission. Please try again.");
        }
    };

    // Handle reject submission
    const handleReject = async (id) => {
        try {
            // Delete the submission from the database
            await API.post("/clothing/deletesubmission", { id });

            // Update UI
            setSubmissions((prev) => prev.filter((s) => s.id !== id));
            setFeedbackMessage("Submission rejected and deleted!");
        } catch (err) {
            console.error("Error rejecting submission:", err);
            setFeedbackMessage("Failed to reject submission. Please try again.");
        }
    };

    // Open edit popup
    const openEditPopup = (submission) => {
        setEditSubmission(submission);
        setEditClothingName(submission.clothing_name);
        setEditDescription(submission.description);
        setEditCustomerId(submission.customerId);
        setShowEditPopup(true);
    };

    // Handle edit submission
    const handleEditSubmission = async () => {
        if (!editClothingName || !editCustomerId) {
            alert("Clothing name and customer ID are required.");
            return;
        }

        try {
            await API.post("/clothing/editsubmission", {
                id: editSubmission.id,
                clothing_name: editClothingName,
                description: editDescription,
                customerId: editCustomerId,
            });

            // Update UI
            setSubmissions((prev) =>
                prev.map((s) =>
                    s.id === editSubmission.id
                        ? {
                              ...s,
                              clothing_name: editClothingName,
                              description: editDescription,
                              customerId: editCustomerId,
                          }
                        : s
                )
            );
            setFeedbackMessage("Submission edited successfully!");
            setShowEditPopup(false);
        } catch (err) {
            console.error("Error editing submission:", err);
            setFeedbackMessage("Failed to edit submission. Please try again.");
        }
    };

    const [showCreatePopup, setShowCreatePopup] = useState(false);
    const [newClothingName, setNewClothingName] = useState("");
    const [newDescription, setNewDescription] = useState("");
    const [newCustomerId, setNewCustomerId] = useState("");

    const handleCreateSubmission = async () => {
        if (!newClothingName || !newCustomerId) {
            alert("Clothing name and customer ID are required.");
            return;
        }

        try {
            await API.post("/clothing/addsubmission", {
                clothing_name: newClothingName,
                description: newDescription,
                customerId: newCustomerId,
            });

            // Fetch updated submissions list after creation
            const response = await API.get("/clothing/submissions");
            setSubmissions(response.data);
            setFeedbackMessage("Submission created successfully!");
            setShowCreatePopup(false);
        } catch (err) {
            console.error("Error creating submission:", err);
            setFeedbackMessage("Failed to create submission. Please try again.");
        }
    };

    return (
        <div className="approval">
            <button onClick={() => setShowCreatePopup(true)} className="create-submission">Create Submission</button>
            {error && <p className="error-message">{error}</p>}
            {feedbackMessage && <p className="feedback-message">{feedbackMessage}</p>}

            {submissions.length > 0 ? (
                submissions.map((submission) => (
                    <div key={submission.id} className="submission">
                        <div className="textinformation">
                            <h1>{submission.clothing_name}</h1>
                            <p className="username">
                                Submitted by: {submission.customerName || "Unknown"}
                            </p>
                            <p className="description">
                                Clothing Description: <br />
                                {submission.description || "No description provided."}
                            </p>
                        </div>
                        <div className="actions">
                            <button onClick={() => handleAccept(submission)}>Accept</button>
                            <button onClick={() => handleReject(submission.id)}>Reject</button>
                            <button onClick={() => openEditPopup(submission)}>Edit</button>
                        </div>
                    </div>
                ))
            ) : (
                <p>No submissions available for approval.</p>
            )}

            {/* Edit Submission Popup */}
            {showEditPopup && (
                <div className="popup">
                    <div className="popup-content">
                        <h2>Edit Submission</h2>
                        <label>
                            Clothing Name:
                            <input
                                type="text"
                                value={editClothingName}
                                onChange={(e) => setEditClothingName(e.target.value)}
                            />
                        </label>
                        <label>
                            Description:
                            <textarea
                                value={editDescription}
                                onChange={(e) => setEditDescription(e.target.value)}
                            />
                        </label>
                        <label>
                            Customer ID:
                            <input
                                type="number"
                                value={editCustomerId}
                                onChange={(e) => setEditCustomerId(e.target.value)}
                            />
                        </label>
                        <div className="popup-buttons">
                            <button onClick={handleEditSubmission}>Save</button>
                            <button onClick={() => setShowEditPopup(false)}>Cancel</button>
                        </div>
                    </div>
                </div>
            )}
            {/* Create Submission Popup */}
            {showCreatePopup && (
                <div className="popup">
                    <div className="popup-content">
                        <h2>Create Submission</h2>
                        <label>
                            Clothing Name:
                            <input
                                type="text"
                                value={newClothingName}
                                onChange={(e) => setNewClothingName(e.target.value)}
                            />
                        </label>
                        <label>
                            Description:
                            <textarea
                                value={newDescription}
                                onChange={(e) => setNewDescription(e.target.value)}
                            />
                        </label>
                        <label>
                            Customer ID:
                            <input
                                type="number"
                                value={newCustomerId}
                                onChange={(e) => setNewCustomerId(e.target.value)}
                            />
                        </label>
                        <div className="popup-buttons">
                            <button onClick={handleCreateSubmission}>Submit</button>
                            <button onClick={() => setShowCreatePopup(false)}>Cancel</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}