import React, { useState, useEffect } from "react";
import "./main.scss";
import API from "../../../../api.jsx";
import { NavLink } from "react-router-dom";

export default function ChatLogListing() {
    const [logs, setLogs] = useState([]);
    const [error, setError] = useState(null);

    const [showCreatePopup, setShowCreatePopup] = useState(false); // Toggle popup
    const [newUser1, setNewUser1] = useState(""); // User 1 ID
    const [newUser2, setNewUser2] = useState(""); // User 2 ID

    useEffect(() => {
        const fetchChatLogs = async () => {
            try {
                const response = await API.get("/logs");
                setLogs(response.data);
            } catch (err) {
                console.error("Error fetching chat logs:", err);
                setError("Failed to fetch chat logs.");
            }
        };

        fetchChatLogs();
    }, []);

    const handleCreateChatLog = async () => {
        if (!newUser1 || !newUser2) {
            alert("Both user IDs are required.");
            return;
        }

        try {
            const response = await API.post("/logs/create", { user1: newUser1, user2: newUser2 });
            alert(response.data.message || "Chat log created successfully!");
            setLogs((prev) => [...prev, { id: response.data.log_id, user1: response.data.user1, user2: response.data.user2 }]);
            setShowCreatePopup(false);
            setNewUser1("");
            setNewUser2("");
        } catch (err) {
            console.error("Error creating chat log:", err);
            alert("Failed to create chat log. Please try again.");
        }
    };

    return (
        <div className="chatlogs">
            <div className="actionbar">
                <p className="chat-log">Chat Logs</p>
                <button onClick={() => setShowCreatePopup(true)}>Create Chat Log</button>
            </div>
            <div className="logs">
                {error && <p className="error-message">{error}</p>}
                {logs.length > 0 ? (
                    logs.map((information) => (
                        <div className="info" key={information.id}>
                            <div>
                                <h1 className="user-1">{information.user1}</h1>
                                <h1 className="user-2">{information.user2}</h1>
                            </div>
                            <p className="action">
                                <NavLink to={`/logs/log/${information.id}`}>Show</NavLink>
                            </p>
                        </div>
                    ))
                ) : (
                    <p>No chats found.</p>
                )}
            </div>

            {/* Create Chat Log Popup */}
            {showCreatePopup && (
                <div className="popup">
                    <div className="popup-content">
                        <h2>Create Chat Log</h2>
                        <label>
                            User 1 ID:
                            <input
                                type="number"
                                value={newUser1}
                                onChange={(e) => setNewUser1(e.target.value)}
                                placeholder="Enter User 1 ID"
                            />
                        </label>
                        <label>
                            User 2 ID:
                            <input
                                type="number"
                                value={newUser2}
                                onChange={(e) => setNewUser2(e.target.value)}
                                placeholder="Enter User 2 ID"
                            />
                        </label>
                        <div className="popup-buttons">
                            <button onClick={handleCreateChatLog}>Create</button>
                            <button onClick={() => setShowCreatePopup(false)}>Cancel</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}