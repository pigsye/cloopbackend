import "./main.scss";
import { NavLink } from "react-router-dom";
import API from "../../../../api.jsx";
import React, { useState, useEffect } from "react";

export default function Orders() {
    const [orders, setOrders] = useState([]);
    const [error, setError] = useState(null);

    const [showCreateOrderPopup, setShowCreateOrderPopup] = useState(false);
    const [newOrderUserId, setNewOrderUserId] = useState("");
    const [newOrderShippingAddress, setNewOrderShippingAddress] = useState("");
    const [newOrderProductIds, setNewOrderProductIds] = useState("");

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const response = await API.get("/orders");
                setOrders(response.data);
            } catch (err) {
                console.error("Error fetching orders:", err);
                setError("Failed to fetch orders. Please try again later.");
            }
        };

        fetchOrders();
    }, []);

    const handleCreateOrder = async () => {
        if (!newOrderUserId || !newOrderShippingAddress) {
            alert("User ID and Shipping Address are required.");
            return;
        }

        // Process product IDs into an array
        const productIds = newOrderProductIds
            .split(",")
            .map((id) => id.trim())
            .filter((id) => id);

        try {
            const response = await API.post("/orders/create", {
                user_id: newOrderUserId,
                shipping_address: newOrderShippingAddress,
                products: productIds, // Send products array to backend
            });
            alert(response.data.message || "Order created successfully!");
            setShowCreateOrderPopup(false);
            setOrders((prev) => [...prev, response.data.order]); // Add the new order to the UI
        } catch (err) {
            console.error("Error creating order:", err);
            alert("Failed to create order.");
        }
    };

    return (
        <div className="orders">
            <div className="actionbar">
                <p className="orders">Orders</p>
            </div>
            <div className="orderss">
                {error && <p className="error-message">{error}</p>}
                {orders.length > 0 ? (
                    orders.map((order) => (
                        <div className="user" key={order.id}>
                            <div className="quoteinfo">
                                <h1 className="name">Order {order.id}</h1>
                                <p className="username">Ordered by {order.user}</p>
                            </div>
                            <p className="action">
                                <NavLink to={`/orders/order/${order.id}`}>Edit</NavLink>
                            </p>
                        </div>
                    ))
                ) : (
                    <p>No orders found.</p>
                )}
            </div>
            <button className="create-order-button" onClick={() => setShowCreateOrderPopup(true)}>
                Create Order
            </button>
            {showCreateOrderPopup && (
                <div className="popup">
                    <div className="popup-content">
                        <h2>Create Order</h2>
                        <label>
                            User ID:
                            <input
                                type="number"
                                value={newOrderUserId}
                                onChange={(e) => setNewOrderUserId(e.target.value)}
                            />
                        </label>
                        <label>
                            Shipping Address:
                            <textarea
                                value={newOrderShippingAddress}
                                onChange={(e) => setNewOrderShippingAddress(e.target.value)}
                            />
                        </label>
                        <label>
                            Product IDs (comma-separated):
                            <input
                                type="text"
                                value={newOrderProductIds}
                                onChange={(e) => setNewOrderProductIds(e.target.value)}
                            />
                        </label>
                        <div className="popup-buttons">
                            <button onClick={handleCreateOrder}>Submit</button>
                            <button onClick={() => setShowCreateOrderPopup(false)}>Cancel</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}