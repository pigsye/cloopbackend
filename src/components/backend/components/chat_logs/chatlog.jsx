import React, { useState, useEffect } from "react";
import "./main.scss";
import API from "../../../../api.jsx";
import { useParams, useNavigate } from "react-router-dom";

export default function ChatLogDetails() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [chatData, setChatData] = useState(null);
    const [error, setError] = useState(null);
    const [showEditPopup, setShowEditPopup] = useState(false);
    const [newUser1, setNewUser1] = useState("");
    const [newUser2, setNewUser2] = useState("");

    useEffect(() => {
        const fetchChatLogDetails = async () => {
            try {
                const response = await API.get(`/logs/${id}`);
                setChatData(response.data);
            } catch (err) {
                console.error("Error fetching chat log details:", err);
                setError("Failed to fetch chat log details.");
            }
        };

        fetchChatLogDetails();
    }, [id]);

    const handleDeleteLog = async () => {
        if (!window.confirm("Are you sure you want to delete this chat log?")) return;

        try {
            await API.delete(`/logs/${id}`);
            alert("Chat log deleted successfully!");
            navigate("/logs"); // Redirect back to chat logs listing
        } catch (err) {
            console.error("Error deleting chat log:", err);
            alert("Failed to delete chat log.");
        }
    };

    const handleEditLog = async () => {
        if (!newUser1.trim() || !newUser2.trim()) {
            alert("Both user IDs are required.");
            return;
        }

        try {
            await API.post(`/logs/${id}/update_users`, {
                user1: newUser1,
                user2: newUser2,
            });
            alert("Chat log users updated successfully!");
            setChatData((prev) => ({
                ...prev,
                user1: newUser1,
                user2: newUser2,
            }));
            setShowEditPopup(false);
        } catch (err) {
            console.error("Error updating chat log users:", err);
            alert("Failed to update chat log users.");
        }
    };

    if (error) return <p className="error-message">{error}</p>;
    if (!chatData) return <p>Loading...</p>;

    return (
        <div className="chatlogs">
            <div className="actionbar">
                <p className="chat-log">Chat Logs</p>
            </div>
            <div className="chat-details">
                <div className="header">
                    <h1>
                        Chat Logs{" "}
                        <span className="edit" onClick={() => setShowEditPopup(true)}>
                            ✎
                        </span>
                    </h1>
                </div>
                <p className="username-1">{chatData.user1}</p>
                <p className="username-2">{chatData.user2}</p>
                <div className="logs">
                    {chatData.logs.map((log, index) => (
                        <div key={index} className="log">
                            <p className="timestamp">
                                {new Date(log.timestamp * 1000).toLocaleString()}
                            </p>
                            <p className={`message user-${log.user}`}>
                                {log.user === 1 ? chatData.user1 : chatData.user2}: {log.message}
                            </p>
                        </div>
                    ))}
                </div>
                <button className="delete-button" onClick={handleDeleteLog}>
                    Delete
                </button>
            </div>

            {/* Edit Users Popup */}
            {showEditPopup && (
                <div className="popup">
                    <div className="popup-content">
                        <h2>Edit Chat Users</h2>
                        <label>
                            User 1 ID:
                            <input
                                type="text"
                                value={newUser1}
                                onChange={(e) => setNewUser1(e.target.value)}
                            />
                        </label>
                        <label>
                            User 2 ID:
                            <input
                                type="text"
                                value={newUser2}
                                onChange={(e) => setNewUser2(e.target.value)}
                            />
                        </label>
                        <div className="popup-buttons">
                            <button onClick={handleEditLog}>Save</button>
                            <button onClick={() => setShowEditPopup(false)}>Cancel</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}