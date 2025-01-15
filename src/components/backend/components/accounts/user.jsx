import React, { useState, useEffect } from "react";
import "./main.scss";
import { useParams } from "react-router-dom";
import API, { BASE_URL } from "../../../../api.jsx";

export default function User() {
    const { id } = useParams();

    const [customer, setCustomer] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [showPasswordPopup, setShowPasswordPopup] = useState(false);
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [formError, setFormError] = useState(""); 

    const [showUsernamePopup, setShowUsernamePopup] = useState(false);
    const [newUsername, setNewUsername] = useState("");

    const [showEmailPopup, setShowEmailPopup] = useState(false);
    const [newEmail, setNewEmail] = useState("");

    const [showProfilePopup, setShowProfilePopup] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);

    const [disabled, setDisabled] = useState(false);
    const [disabledUntil, setDisabledUntil] = useState(null);

    const [showDisablePopup, setShowDisablePopup] = useState(false);
    const [disableDuration, setDisableDuration] = useState("3600");

    const [showDeletePopup, setShowDeletePopup] = useState(false);

    useEffect(() => {
        const fetchCustomer = async () => {
            try {
                const response = await API.get(`/user/${id}`);
                const data = response.data;
    
                // Safely prepend base URL to profile picture
                data.pfp = data.pfp ? prependBaseURL(data.pfp) : "/public/sample_pfp.svg";
    
                // Safely prepend base URL to product images
                if (data.products) {
                    Object.values(data.products).forEach((product) => {
                        if (product.image) {
                            product.image = prependBaseURL(product.image);
                        }
                    });
                }
    
                // Safely prepend base URL to wishlist images
                if (data.wishlist) {
                    Object.values(data.wishlist).forEach((item) => {
                        if (item.image) {
                            item.image = prependBaseURL(item.image);
                        }
                    });
                }
    
                setCustomer(data);
    
                // Handle account status
                if (data.disabled) {
                    setDisabled(true);
                    setDisabledUntil(data.disabled_until ? new Date(data.disabled_until * 1000) : null);
                } else {
                    setDisabled(false);
                    setDisabledUntil(null);
                }
            } catch (err) {
                console.error("Error fetching customer data:", err);
                setError("Failed to load customer information.");
            } finally {
                setLoading(false);
            }
        };
    
        fetchCustomer();
    }, [id]);

    const updateInformation = async (update, to) => {
        try {
            const payload = { update, to };
            const response = await API.post(`/updateinformation/${id}`, payload);
            alert(response.data.message || `${update} updated successfully!`);
            return true;
        } catch (err) {
            console.error(`Error updating ${update}:`, err);
            alert(`Failed to update ${update}.`);
            return false;
        }
    };

    const handleUpdateUsername = async () => {
        if (!newUsername.trim()) {
            alert("Username cannot be empty.");
            return;
        }

        const success = await updateInformation("username", newUsername);
        if (success) {
            setCustomer((prev) => ({ ...prev, name: newUsername }));
            setNewUsername("");
            setShowUsernamePopup(false);
        }
    };

    const validateEmail = (email) => {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    };
    
    const handleUpdatePassword = async () => {
        // Validate password fields
        if (!newPassword || !confirmPassword) {
            alert("Both password fields are required.");
            return;
        }
    
        if (newPassword.length < 8) {
            alert("Password must be at least 8 characters.");
            return;
        }
    
        if (newPassword !== confirmPassword) {
            alert("Passwords do not match.");
            return;
        }
    
        const success = await updateInformation("password", newPassword);
        if (success) {
            setNewPassword("");
            setConfirmPassword("");
            setShowPasswordPopup(false);
        }
    };
    
    const handleUpdateEmail = async () => {
        // Validate email
        if (!newEmail) {
            alert("Email cannot be empty.");
            return;
        }
    
        if (!validateEmail(newEmail)) {
            alert("Please enter a valid email address.");
            return;
        }
    
        const success = await updateInformation("email", newEmail);
        if (success) {
            setCustomer((prev) => ({ ...prev, email: newEmail }));
            setNewEmail("");
            setShowEmailPopup(false);
        }
    };

    const handleFileChange = (e) => {
        setSelectedFile(e.target.files[0]);
    };

    const handleUploadProfilePicture = async () => {
        if (!selectedFile) {
            alert("Please select a file first.");
            return;
        }

        const formData = new FormData();
        formData.append("file", selectedFile);

        try {
            const response = await API.post(`/changeprofile/${id}`, formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            alert(response.data.message || "Profile picture updated successfully!");
            setCustomer((prev) => ({ ...prev, pfp: response.data.url }));
            setShowProfilePopup(false);
        } catch (err) {
            console.error("Error uploading profile picture:", err);
            alert("Failed to upload profile picture.");
        }
    };

    const prependBaseURL = (url) => {
        if (!url || typeof url !== "string") return ""; // Handle null, undefined, or non-string values
        return url.startsWith("/uploads") ? `${BASE_URL}${url}` : url;
    };

    const updateAccountStatus = async (action) => {
        try {
            const payload = { function: action, duration: action === "disable" ? disableDuration : null };
            const response = await API.post(`/accountstatus/${id}`, payload);

            alert(response.data.message || `Account ${action}d successfully!`);

            if (action === "disable") {
                setDisabled(true);
                setDisabledUntil(Date.now() + disableDuration * 1000); // Estimate expiry
            } else {
                setDisabled(false);
                setDisabledUntil(null);
            }

            setShowDisablePopup(false);
        } catch (err) {
            console.error(`Error updating account status: ${err}`);
            alert(`Failed to ${action} account.`);
        }
    };

    const formatTimeLeft = () => {
        if (!disabledUntil) return "N/A";

        const timeLeft = Math.max(0, Math.floor((disabledUntil - Date.now()) / 1000));
        const hours = Math.floor(timeLeft / 3600);
        const minutes = Math.floor((timeLeft % 3600) / 60);
        const seconds = timeLeft % 60;

        return `${hours}h ${minutes}m ${seconds}s`;
    };

    const handleDeleteAccount = async () => {
        try {
            const response = await API.post(`/deleteaccount/${id}`);
            alert(response.data.message || "Account deleted successfully.");
            // Redirect or update UI after deletion
        } catch (err) {
            console.error("Error deleting account:", err);
            alert("Failed to delete account.");
        }
    };

    if (loading) return <p>Loading...</p>;
    if (error) return <p>{error}</p>;

    const products = Object.values(customer?.products || {});
    const ratings = Object.values(customer?.ratings || {});
    const wishlist = Object.values(customer?.wishlist || {});

    return (
        <div className="user-page">
            <div className="information">
                <p>Accounts</p>
            </div>

            <div className="user-info">
                <div className="bar-one">
                    <h1>
                        {customer?.name}{" "}
                        <span
                            className="edit"
                            onClick={() => setShowUsernamePopup(true)}
                        >
                            ✎
                        </span>
                    </h1>
                    <p className="update-password" onClick={() => setShowPasswordPopup(true)}>
                        Update Password
                    </p>
                    <img
                        src={customer?.pfp || "/public/sample_pfp.svg"}
                        alt="Profile"
                        className="profile-picture"
                        onClick={() => setShowProfilePopup(true)}
                    />
                </div>

                <div className="bar-two">
                    <p>
                        Email: {customer?.email}{" "}
                        <span className="edit" onClick={() => setShowEmailPopup(true)}>
                            ✎
                        </span>
                    </p>
                </div>

                {/* Username Popup */}
                {showUsernamePopup && (
                    <div className="popup">
                        <div className="popup-content">
                            <h2>Update Username</h2>
                            <input
                                type="text"
                                value={newUsername}
                                onChange={(e) => setNewUsername(e.target.value)}
                            />
                            <div className="popup-buttons">
                                <button onClick={handleUpdateUsername}>Submit</button>
                                <button onClick={() => setShowUsernamePopup(false)}>Cancel</button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Email Popup */}
                {showEmailPopup && (
                    <div className="popup">
                        <div className="popup-content">
                            <h2>Update Email</h2>
                            <input
                                type="email"
                                value={newEmail}
                                onChange={(e) => setNewEmail(e.target.value)}
                            />
                            <div className="popup-buttons">
                                <button onClick={handleUpdateEmail}>Submit</button>
                                <button onClick={() => setShowEmailPopup(false)}>Cancel</button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Password Popup */}
                {showPasswordPopup && (
                    <div className="popup">
                        <div className="popup-content">
                            <h2>Update Password</h2>
                            {formError && <p className="form-error">{formError}</p>}
                            <label>
                                New Password:
                                <input
                                    type="password"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                />
                            </label>
                            <label>
                                Confirm New Password:
                                <input
                                    type="password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                />
                            </label>
                            <div className="popup-buttons">
                                <button onClick={handleUpdatePassword}>Submit</button>
                                <button onClick={() => setShowPasswordPopup(false)}>Cancel</button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Profile Picture Popup */}
                {showProfilePopup && (
                    <div className="popup">
                        <div className="popup-content">
                            <h2>Upload New Profile Picture</h2>
                            <input type="file" onChange={handleFileChange} />
                            <div className="popup-buttons">
                                <button onClick={handleUploadProfilePicture}>Upload</button>
                                <button onClick={() => setShowProfilePopup(false)}>Cancel</button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Products Section */}
                <div className="bar-three">
                    <p className="main-text">Products Listed</p>
                </div>
                {products.length > 0 ? (
                    <div>
                        {products.map((product, index) => (
                            <div key={index} className="bar-four">
                                <img src={product.image} alt={product.name} />
                                <h1>{product.name}</h1>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="error">No products listed.</p>
                )}

                {/* Ratings Section */}
                <div className="bar-three">
                    <p className="main-text">Ratings Given</p>
                </div>
                {ratings.length > 0 ? (
                    <div>
                        {ratings.map((rating, index) => (
                            <div key={index} className="bar-five">
                                <h1>
                                    {rating.rater} rated {rating.score} / 5
                                </h1>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="error">No ratings given.</p>
                )}

                {/* Wishlist Section */}
                <div className="bar-three">
                    <p className="main-text">Wishlist Products</p>
                </div>
                {wishlist.length > 0 ? (
                    <div>
                        {wishlist.map((item, index) => (
                            <div key={index} className="bar-five">
                                <h1>{item.name}</h1>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="error">No wishlist items.</p>
                )}

                <div className="account-status">
                    {disabled ? (
                        <button onClick={() => updateAccountStatus("enable")}>
                            Enable Account (Time Left: {formatTimeLeft()})
                        </button>
                    ) : (
                        <button onClick={() => setShowDisablePopup(true)}>Disable Account</button>
                    )}
                    <button className="delete-account-button" onClick={() => setShowDeletePopup(true)}>
                        Delete Account
                    </button>
                </div>

                {/* Delete Confirmation Popup */}
                {showDeletePopup && (
                    <div className="popup">
                        <div className="popup-content">
                            <h2>Delete Account</h2>
                            <p>Are you sure you want to delete this account? This action cannot be undone.</p>
                            <div className="popup-buttons">
                                <button onClick={handleDeleteAccount}>Confirm</button>
                                <button onClick={() => setShowDeletePopup(false)}>Cancel</button>
                            </div>
                        </div>
                    </div>
                )}
                
                {/* Disable Popup */}
                {showDisablePopup && (
                    <div className="popup">
                        <div className="popup-content">
                            <h2>Disable Account</h2>
                            <label>
                                Disable Duration:
                                <select
                                    value={disableDuration}
                                    onChange={(e) => setDisableDuration(e.target.value)}
                                >
                                    <option value="3600">1 Hour</option>
                                    <option value="86400">1 Day</option>
                                    <option value="604800">1 Week</option>
                                    <option value="2592000">1 Month</option>
                                    <option value="31536000">1 Year</option>
                                </select>
                            </label>
                            <div className="popup-buttons">
                                <button onClick={() => updateAccountStatus("disable")}>
                                    Confirm
                                </button>
                                <button onClick={() => setShowDisablePopup(false)}>Cancel</button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}