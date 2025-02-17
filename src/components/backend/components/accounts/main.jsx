import React, { useState, useEffect } from "react";
import "./main.scss";
import API, { BASE_URL } from "../../../../api.jsx";
import { NavLink } from "react-router-dom";

export default function Accounts() {
    const [accounts, setAccounts] = useState([]);

    // Helper function to prepend the base URL to image paths
    const prependBaseURL = (url) => {
        return url.startsWith("/uploads") ? `${BASE_URL}${url}` : url;
    };

    useEffect(() => {
        const fetchAccounts = async () => {
            try {
                const response = await API.get("/account");

                // Prepend the base URL to profile picture URLs
                const updatedAccounts = response.data.map((account) => ({
                    ...account,
                    pfp: `${BASE_URL}/uploads/${account.pfp}`,
                }));

                setAccounts(updatedAccounts);
            } catch (error) {
                console.error("Error fetching accounts:", error);
            }
        };

        fetchAccounts();
    }, []);

    return (
        <div className="accounts">
            <div className="actionbar">
                <p className="user-listing">User Listing</p>
                <NavLink to="/accounts/reports">
                    <p className="user-reports">Reported Users</p>
                </NavLink>
                <NavLink to="/accounts/createAccount">
                    <p className="create-account">Create Account</p>
                </NavLink>
            </div>
            <div className="users">
                {accounts.length > 0 ? (
                    accounts.map((information) => (
                        <div className="user" key={information.id}>
                            <img
                                src={information.pfp}
                                alt="Profile"
                            />
                            <h1 className="name">{information.username}</h1>
                            <p className="action">
                                <NavLink to={`/accounts/user/${information.id}`}>Edit</NavLink>
                            </p>
                        </div>
                    ))
                ) : (
                    <p>No users found.</p>
                )}
            </div>
        </div>
    );
}