import "./main.scss";
import { NavLink } from "react-router-dom";
import API, { BASE_URL } from "../../../../api.jsx";
import React, { useState, useEffect } from "react";

export default function Clothing() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // States for create product popup
    const [showCreatePopup, setShowCreatePopup] = useState(false);
    const [newProductName, setNewProductName] = useState("");
    const [newProductOwner, setNewProductOwner] = useState("");
    const [popupError, setPopupError] = useState("");

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await API.get("/products");
                const data = response.data;

                // Prepend BASE_URL to image URLs if necessary
                const updatedProducts = data;
                setProducts(updatedProducts);
            } catch (err) {
                console.error("Error fetching products:", err);
                setError("Failed to load clothing data.");
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    const handleCreateProduct = async () => {
        if (!newProductName || !newProductOwner) {
            setPopupError("Please fill in all fields.");
            return;
        }

        try {
            const payload = {
                name: newProductName,
                customer_id: newProductOwner,
            };
            const response = await API.post("/products/create", payload);
            alert(response.data.message || "Product created successfully!");
            setProducts((prev) => [...prev, response.data.product]);
            setShowCreatePopup(false);
            setNewProductName("");
            setNewProductOwner("");
            setPopupError("");
        } catch (err) {
            console.error("Error creating product:", err);
            setPopupError("Failed to create product.");
        }
    };

    if (loading) return <p>Loading...</p>;
    if (error) return <p>{error}</p>;

    return (
        <div className="clothing">
            <div className="actionbar">
                <p className="user-listing">Clothing Listing</p>
                <NavLink to="/clothing/approve">
                    <p className="approve-submissions">Approve Submissions</p>
                </NavLink>
                <button className="create-product-button" onClick={() => setShowCreatePopup(true)}>
                    Create Product
                </button>
            </div>
            <div className="garments">
                {products.length > 0 ? (
                    products.map((information) => (
                        <div className="perpiece" key={information.id}>
                            <img
                                src={`${BASE_URL}${information.image_url}`}
                                className="clothing-image"
                                alt={information.name}
                            />
                            <div className="information">
                                <h1>{information.name}</h1>
                                <p>{information.username}</p>
                            </div>
                            <h1 className="edit-button">
                                <NavLink to={`/clothing/listing/${information.id}`}>Edit</NavLink>
                            </h1>
                        </div>
                    ))
                ) : (
                    <p className="no-clothings-found">No clothings found.</p>
                )}
            </div>

            {/* Create Product Popup */}
            {showCreatePopup && (
                <div className="popup">
                    <div className="popup-content">
                        <h2>Create Product</h2>
                        {popupError && <p className="popup-error">{popupError}</p>}
                        <label>
                            Product Name:
                            <input
                                type="text"
                                value={newProductName}
                                onChange={(e) => setNewProductName(e.target.value)}
                            />
                        </label>
                        <label>
                            Owner (User ID):
                            <input
                                type="number"
                                value={newProductOwner}
                                onChange={(e) => setNewProductOwner(e.target.value)}
                            />
                        </label>
                        <div className="popup-buttons">
                            <button onClick={handleCreateProduct}>Submit</button>
                            <button onClick={() => setShowCreatePopup(false)}>Cancel</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}