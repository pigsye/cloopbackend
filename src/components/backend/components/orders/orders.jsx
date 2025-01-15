import "./main.scss";
import API from "../../../../api.jsx";
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

export default function OrderDetails() {
    const { id } = useParams();
    const [orderInformation, setOrderInformation] = useState(null);
    const [error, setError] = useState(null);

    const [showUserPopup, setShowUserPopup] = useState(false);
    const [newUserId, setNewUserId] = useState("");

    const [showAddressPopup, setShowAddressPopup] = useState(false);
    const [newAddress, setNewAddress] = useState("");

    const [products, setProducts] = useState([]); // Track products for removal

    useEffect(() => {
        const fetchOrderDetails = async () => {
            try {
                const response = await API.get(`/orders/${id}`);
                setOrderInformation(response.data);
                setProducts(response.data.products); // Initialize products state
            } catch (err) {
                console.error("Error fetching order details:", err);
                setError("Failed to fetch order details. Please try again later.");
            }
        };

        fetchOrderDetails();
    }, [id]);

    const handleUpdateUser = async () => {
        try {
            const response = await API.post(`/orders/${id}/update_user`, { user_id: newUserId });
            alert(response.data.message || "User updated successfully!");
            setOrderInformation((prev) => ({ ...prev, order_user: `User ID: ${newUserId}` }));
            setShowUserPopup(false);
        } catch (err) {
            console.error("Error updating user:", err);
            alert("Failed to update user.");
        }
    };

    const handleUpdateAddress = async () => {
        try {
            const response = await API.post(`/orders/${id}/update_address`, { shipping_address: newAddress });
            alert(response.data.message || "Address updated successfully!");
            setOrderInformation((prev) => ({ ...prev, shipping_address: newAddress }));
            setShowAddressPopup(false);
        } catch (err) {
            console.error("Error updating address:", err);
            alert("Failed to update address.");
        }
    };

    const handleRemoveProduct = async (productName) => {
        try {
            const response = await API.post(`/orders/${id}/remove_product`, { product_name: productName });
            alert(response.data.message || "Product removed successfully!");
            setProducts((prev) => prev.filter((product) => product.name !== productName));
        } catch (err) {
            console.error("Error removing product:", err);
            alert("Failed to remove product.");
        }
    };

    const handleDeleteOrder = async () => {
        try {
            const response = await API.delete(`/orders/${id}/delete`);
            alert(response.data.message || "Order deleted successfully!");
            window.location.href = "/orders"; // Redirect to orders list after deletion
        } catch (err) {
            console.error("Error deleting order:", err);
            alert("Failed to delete order.");
        }
    };

    if (error) return <p className="error-message">{error}</p>;
    if (!orderInformation) return <p>Loading...</p>;

    const { name, order_user, shipping_address } = orderInformation;

    return (
        <div className="order-listing">
            <div className="actionbar">
                <p className="orders">Order</p>
            </div>
            <div className="orderss">
                <h1 className="order-name">{name}</h1>
                <p className="order-username">
                    Ordered by: {order_user}{" "}
                    <span className="edit" onClick={() => setShowUserPopup(true)}>
                        ✎
                    </span>
                </p>
                <p className="products-bought">Products Bought:</p>
                {products.length > 0 ? (
                    products.map((product) => (
                        <div className="products" key={product.name}>
                            <p>{product.name}</p>
                            <button onClick={() => handleRemoveProduct(product.name)}>X</button>
                        </div>
                    ))
                ) : (
                    <p>No products found.</p>
                )}
                <p className="shipping-address">
                    Shipping Address: <span className="edit" onClick={() => setShowAddressPopup(true)}>✎</span>
                    <br />{shipping_address}{" "}
                </p>

                <button
                    className="delete-order-button"
                    onClick={() => {
                        const confirmed = window.confirm("Are you sure you want to delete this order?");
                        if (confirmed) {
                            handleDeleteOrder();
                        }
                    }}
                >
                    Delete Order
                </button>
            </div>

            

            {/* Update User Popup */}
            {showUserPopup && (
                <div className="popup">
                    <div className="popup-content">
                        <h2>Update User</h2>
                        <input
                            type="text"
                            value={newUserId}
                            onChange={(e) => setNewUserId(e.target.value)}
                            placeholder="Enter new User ID"
                        />
                        <div className="popup-buttons">
                            <button onClick={handleUpdateUser}>Save</button>
                            <button onClick={() => setShowUserPopup(false)}>Cancel</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Update Address Popup */}
            {showAddressPopup && (
                <div className="popup">
                    <div className="popup-content">
                        <h2>Update Address</h2>
                        <textarea
                            value={newAddress}
                            onChange={(e) => setNewAddress(e.target.value)}
                            placeholder="Enter new address"
                        />
                        <div className="popup-buttons">
                            <button onClick={handleUpdateAddress}>Save</button>
                            <button onClick={() => setShowAddressPopup(false)}>Cancel</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}