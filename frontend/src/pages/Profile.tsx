import React, { useState, useEffect } from "react";
import axios from "axios";
import '../Styles/Profile.css';
import { AxiosError } from 'axios'; // Import AxiosError type

interface Customer {
    customerFirstName: string;
    customerLastName: string;
    customerEmail: string;
}

interface Review {
    reviewId: number;
    productId: number;
    productName: string;
    customerId: number;
    customerFirstName: string;
    customerLastName: string;
    rating: number;
    comment: string;
    createdAt: string;
}


type Order = {
    orderId: number;
    productId: number;
    productName: string;
    gender: string;
    quantity: number;
    price: number;
    customerId: number;
    orderDate: string;
    paymentMethod: string;
    cardNumber: string;
};


interface ProfileProps {
    setIsLoggedIn: (value: boolean) => void;
}

export function Profile({ setIsLoggedIn }: ProfileProps) {
    const [customer, setCustomer] = useState<Customer | null>(null);
    const [reviews, setReviews] = useState<Review[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [userId, setUserId] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [isEditing, setIsEditing] = useState<boolean>(false);
    const [firstName, setFirstName] = useState<string>('');
    const [lastName, setLastName] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [reviewsVisible, setReviewsVisible] = useState<boolean>(false);
    const [orders, setOrders] = useState<any[]>([]);
    const [admin, setAdmin] = useState<boolean>(false);
    const [ordersVisible, setOrdersVisible] = useState<boolean>(false); // New state for orders visibility

    
    useEffect(() => {
        const storedUserId = localStorage.getItem("userId");
        if (storedUserId) {
            setUserId(storedUserId);
            fetchCustomerByFunction(parseInt(storedUserId));
            fetchReviews(parseInt(storedUserId));
        } else {
            setIsLoading(false);
        }
    }, []);

    const fetchCustomerByFunction = async (id: number) => {
        try {
            setIsLoading(true);
            const response = await axios.get(`https://localhost:7192/api/Customer/get-customer-by-function/${id}`);
            setCustomer(response.data);
            setFirstName(response.data.customerFirstName);
            setLastName(response.data.customerLastName);
            setEmail(response.data.customerEmail);
            setError(null);
        } catch (error) {
            console.error("Error fetching customer:", error);
            setError("Error fetching customer. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    const fetchReviews = async (id: number) => {
        try {
            const response = await axios.get(`https://localhost:7192/api/Review/select-review-from-customer-via-function?CustomerId=${id}`);
            setReviews(response.data);
        } catch (error) {
            console.error("Error fetching reviews:", error);
            setError("Error fetching reviews. Please try again.");
        }
    };

    const deleteReview = async (reviewId: number, productId: number) => {
        try {
            console.log("Deleting review with ID:", reviewId, "for product with ID:", productId);
            await axios.post(`https://localhost:7192/api/Review/delete-review-via-procedure-with-customer_id-and-product_id`, null, {
                params: {
                    CustomerId: userId,  // Burada `userId` kullanarak ilgili kullanıcının ID'sini gönderiyoruz
                    ProductId: productId
                }
            });
            setReviews(reviews.filter(review => review.reviewId !== reviewId)); // Yorumları güncelle
        } catch (error) {
            console.error("Error deleting review:", error);
            setError("Error deleting review. Please try again.");
        }
    };
    

   
    const fetchOrders = async (id: number) => {
        try {
            const response = await axios.get(`https://localhost:7192/api/Order/select-orders-join-ordered_items-join-products-with-customer_id-via-function?CustomerId=${id}`);
            setOrders(response.data);
        } catch (error) {
            console.error("Error fetching orders:", error);
            setError("Error fetching orders. Please try again.");
        }
    };

    useEffect(() => {
        const storedUserId = localStorage.getItem("userId");
        if (storedUserId) {
            setUserId(storedUserId);
            const parsedId = parseInt(storedUserId);
            fetchCustomerByFunction(parsedId);
            fetchReviews(parsedId);
            fetchOrders(parsedId);  // Fetch orders
        } else {
            setIsLoading(false);
        }
    }, []);

    const groupedOrders = orders.reduce<{ orderId: number; items: Order[]; totalPrice: number }[]>((
        acc, order) => {
        const existingOrder = acc.find((o) => o.orderId === order.orderId);
        if (existingOrder) {
            existingOrder.items.push(order);
            existingOrder.totalPrice += order.price * order.quantity;
        } else {
            acc.push({
                orderId: order.orderId,  
                items: [order],
                totalPrice: order.price * order.quantity
            });
        }
        return acc;
    }, []);

    // Toggle function for showing/hiding orders
    const toggleOrdersVisibility = () => {
        setOrdersVisible(!ordersVisible);
    };

    
    const handleLogout = () => {
        const storedUserId = localStorage.getItem("userId");
        const customerId = storedUserId ? parseInt(storedUserId) : undefined;

        // Check if the user is an admin (assuming admin ID is 10)
        if (customerId === 10) {
            setAdmin(true);
            console.log(admin);
        }
        else{
            setAdmin(false);
            console.log(admin);
        }

        localStorage.removeItem("authToken");
        setIsLoggedIn(false);
        console.log("Logged out successfully.");
    };

    const handleEditProfile = () => {
        setIsEditing(true);
    };

    const handleSaveProfile = async () => {
        try {
            const response = await axios.post(
                `https://localhost:7192/api/Customer/procedure-edit-profile?CustomerId=${userId}&CustomerFirstName=${firstName}&CustomerLastName=${lastName}&CustomerEmail=${email}&PasswordHash=${password}`,
                {}
            );
    
            console.log("API response:", response); // Log the API response
    
            if (response.status === 200) {
                setCustomer({
                    customerFirstName: firstName,
                    customerLastName: lastName,
                    customerEmail: email,
                });
                setIsEditing(false);
    
                // Show success message in a popup (using alert)
                alert("Profile updated successfully!");
            }
        } catch (error: unknown) { // Explicitly type 'error' as 'unknown'
            console.error("Error updating profile:", error);
    
            if (error instanceof AxiosError) { // Check if 'error' is an AxiosError
                // Extract the error message from the response data and display it in an alert
                const errorMessage = error.response?.data.message || "An error occurred.";
                alert(errorMessage);  // Show the error message in an alert
            } else {
                alert("Error updating profile. Please try again.");
            }
        }
    };
    

    const renderStarsFromRating = (rating: number) => {
        const stars = [];
        for (let i = 1; i <= 5; i++) {
            stars.push(
                <span
                    key={i}
                    className={`star ${i <= rating ? "filled" : ""}`}
                >
                    ★
                </span>
            );
        }
        return stars;
    };

    const toggleReviewsVisibility = () => {
        setReviewsVisible(!reviewsVisible); // Toggle the visibility
    };

    if (isLoading) {
        return <p>Loading...</p>;
    }

    return (
        <div className="Profile">
            <h1 className="Profile__title">Customer Information</h1>
    
            {customer && !isEditing ? (
                <div className="Profile__card">
                    <p><strong>First Name:</strong> {customer.customerFirstName}</p>
                    <p><strong>Last Name:</strong> {customer.customerLastName}</p>
                    <p><strong>Email:</strong> {customer.customerEmail}</p> 
                    <button onClick={handleEditProfile}>Edit Profile</button>
                </div>
            ) : (
                <div className="Profile__edit-form">
                    <div>
                        <label>First Name:</label>
                        <input
                            type="text"
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                        />
                    </div>
                    <div>
                        <label>Last Name:</label>
                        <input
                            type="text"
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                        />
                    </div>
                    <div>
                        <label>Email:</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                    <div>
                        <label>Password:</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                    <button onClick={handleSaveProfile}>Save</button>
                    <button onClick={() => setIsEditing(false)}>Cancel</button>
                </div>
            )}
    
            {error && <p className="Profile__error">{error}</p>}
            {successMessage && <p className="Profile__success">{successMessage}</p>} 
    
            
            <div className="order-history">
    <button onClick={toggleOrdersVisibility}>
        {ordersVisible ? 'Hide Orders' : 'Show Orders'}
    </button>
    {ordersVisible && (
        <div>
            {groupedOrders.length > 0 ? (
                groupedOrders.map((group) => (
                    <div key={group.orderId} className="order-group">
                        <div className="order-header">
                            <div className="total-price">
                                <p><strong>Total Price:</strong> ${group.totalPrice.toFixed(2)}</p>
                            </div>
                        </div>
                        <div className="order-items">
                            {group.items.map((item, idx) => (
                                <div key={idx} className="order-item-row">
                                    <p><strong>Product Name:</strong> {item.productName}</p>
                                    <p><strong>Quantity:</strong> {item.quantity}</p>
                                    <p><strong>Unit Price:</strong> ${item.price}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                ))
            ) : (
                <p>No orders found.</p>
            )}
        </div>
    )}
</div>
    
            <div className="product-reviews">
                <button onClick={toggleReviewsVisibility}>
                    {reviewsVisible ? 'Hide Reviews' : 'Show Reviews'}
                </button>
                {reviewsVisible && (
                    <div>
                        {reviews.length > 0 ? (
                            reviews.map((review) => (
                                <div key={review.reviewId} className="review">
                                    <p><strong>Product: {review.productName}</strong></p>
                                    <p><strong>{review.customerFirstName} {review.customerLastName}</strong></p>
                                    <p>Rating: {renderStarsFromRating(review.rating)}</p>
                                    <p>Comment: {review.comment}</p>
                                    <p>Date: {new Date(review.createdAt).toLocaleDateString()}</p>
                                    <button
                                        onClick={() => deleteReview(review.reviewId, review.productId)}
                                        className="delete-button"
                                    >
                                        Delete Review
                                    </button>
                                </div>
                            ))
                        ) : (
                            <p>You didnt make any reviews yet!.</p>
                        )}
                    </div>
                )}
            </div>
    
            <button className="Profile__logout-button" onClick={handleLogout}>Logout</button>
        </div>
    );
}

export default Profile;
