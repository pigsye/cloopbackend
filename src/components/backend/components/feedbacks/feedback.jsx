import React, { useState, useEffect } from "react";
import "./main.scss";
import API from "../../../../api.jsx";
import { useParams, useNavigate } from "react-router-dom";

export default function FeedbackDetail() {
    const { id } = useParams(); // Read the feedback ID from the URL
    const navigate = useNavigate();
    const [feedback, setFeedback] = useState(null);
    const [error, setError] = useState(null);

    const [showEditPopup, setShowEditPopup] = useState(false);
    const [newFeedbackText, setNewFeedbackText] = useState("");
    const [newUserId, setNewUserId] = useState("");

    useEffect(() => {
        const fetchFeedback = async () => {
            try {
                const response = await API.get(`/feedback/${id}`);
                setFeedback(response.data);
                setNewFeedbackText(response.data.feedback);
                setNewUserId(response.data.user_id);
            } catch (err) {
                console.error("Error fetching feedback:", err);
                setError("Failed to fetch feedback.");
            }
        };

        fetchFeedback();
    }, [id]);

    const handleDelete = async () => {
        try {
            await API.post(`/feedback/delete`, { id });
            alert("Feedback deleted successfully.");
            navigate("/feedbacks");
        } catch (err) {
            console.error("Error deleting feedback:", err);
            alert("Failed to delete feedback.");
        }
    };

    const handleEdit = async () => {
        try {
            await API.post(`/feedback/update`, { id, user_id: newUserId, feedback: newFeedbackText });
            alert("Feedback updated successfully!");
            setFeedback((prev) => ({ ...prev, user_id: newUserId, feedback: newFeedbackText }));
            setShowEditPopup(false);
        } catch (err) {
            console.error("Error updating feedback:", err);
            alert("Failed to update feedback.");
        }
    };

    if (error) return <p>{error}</p>;
    if (!feedback) return <p>Loading...</p>;

    return (
        <div className="feedback">
            <div className="actionbar">
                <p className="feedbacks">Feedback</p>
            </div>
            <div className="feetback">
                <h1>Feedback by: {feedback.username}</h1>
                <p>{feedback.feedback}</p>
                <div className="buttons-3">
                    <button onClick={() => setShowEditPopup(true)}>Edit Feedback</button>
                    <button onClick={handleDelete}>Delete Feedback</button>
                </div>
            </div>

            {/* Edit Feedback Popup */}
            {showEditPopup && (
                <div className="popup">
                    <div className="popup-content">
                        <h2>Edit Feedback</h2>
                        <label>
                            User ID:
                            <input
                                type="text"
                                value={newUserId}
                                onChange={(e) => setNewUserId(e.target.value)}
                                placeholder="Enter new User ID"
                            />
                        </label>
                        <label>
                            Feedback:
                            <textarea
                                value={newFeedbackText}
                                onChange={(e) => setNewFeedbackText(e.target.value)}
                                placeholder="Enter new feedback text"
                            />
                        </label>
                        <div className="popup-buttons">
                            <button onClick={handleEdit}>Save</button>
                            <button onClick={() => setShowEditPopup(false)}>Cancel</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}