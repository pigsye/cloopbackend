import React, { useState, useEffect } from "react";
import "./main.scss";
import API from "../../../../api.jsx";
import { NavLink } from "react-router-dom";

export default function FeedbackList() {
    const [feedbacks, setFeedbacks] = useState([]);
    const [error, setError] = useState(null);

    const [showCreatePopup, setShowCreatePopup] = useState(false); // Toggle create feedback popup
    const [newUserId, setNewUserId] = useState(""); // New feedback user ID
    const [newFeedback, setNewFeedback] = useState(""); // New feedback text

    useEffect(() => {
        const fetchFeedbacks = async () => {
            try {
                const response = await API.get("/feedback");
                setFeedbacks(response.data);
            } catch (err) {
                console.error("Error fetching feedbacks:", err);
                setError("Failed to fetch feedbacks.");
            }
        };

        fetchFeedbacks();
    }, []);

    const handleCreateFeedback = async () => {
        if (!newUserId.trim() || !newFeedback.trim()) {
            alert("Both User ID and Feedback are required.");
            return;
        }

        try {
            const response = await API.post("/feedback/create", {
                user_id: newUserId,
                feedback: newFeedback,
            });

            alert(response.data.message || "Feedback created successfully!");
            setFeedbacks((prev) => [...prev, response.data.feedback]); // Add new feedback to UI
            setNewUserId("");
            setNewFeedback("");
            setShowCreatePopup(false);
        } catch (err) {
            console.error("Error creating feedback:", err);
            alert("Failed to create feedback. Please try again.");
        }
    };

    return (
        <div className="feedback">
            <div className="actionbar">
                <p className="feedbacks">Feedbacks</p>
                <button className="create-feedback" onClick={() => setShowCreatePopup(true)}>
                    Create Feedback
                </button>
            </div>
            <div className="feedbackss">
                {error && <p className="error">{error}</p>}
                {feedbacks.length > 0 ? (
                    feedbacks.map((information) => (
                        <div className="feedbacksss" key={information.id}>
                            <h1 className="name">{information.username}</h1>
                            <p className="action">
                                <NavLink to={`/feedbacks/feedback/${information.id}`}>Edit</NavLink>
                            </p>
                        </div>
                    ))
                ) : (
                    <p>No feedbacks found.</p>
                )}
            </div>

            {/* Create Feedback Popup */}
            {showCreatePopup && (
                <div className="popup">
                    <div className="popup-content">
                        <h2>Create New Feedback</h2>
                        <label>
                            User ID:
                            <input
                                type="number"
                                value={newUserId}
                                onChange={(e) => setNewUserId(e.target.value)}
                                placeholder="Enter user ID"
                            />
                        </label>
                        <label>
                            Feedback:
                            <textarea
                                value={newFeedback}
                                onChange={(e) => setNewFeedback(e.target.value)}
                                placeholder="Enter feedback"
                            />
                        </label>
                        <div className="popup-buttons">
                            <button onClick={handleCreateFeedback}>Submit</button>
                            <button onClick={() => setShowCreatePopup(false)}>Cancel</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}