import React, { useEffect, useState } from 'react';
import { urlCustomers } from "../endpoints";
import '../Styles/App.css';
import axios from 'axios';

export function Customers() {
  interface Customer {
    customerId: number;
    customerFirstName: string;
    customerLastName: string;
    customerEmail: string;
    passwordHash: string;
    createdAt: Date;
    updatedAt: Date;
    isMuted?: boolean;
  }

  // Review interface
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

  const [customers, setCustomers] = useState<Customer[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState<number | null>(null); // For toggling visibility of details
  const [reviews, setReviews] = useState<any[]>([]); // For storing customer reviews
  const [error, setError] = useState<string | null>(null); // For error handling
  const [isLoading, setIsLoading] = useState(false); // For loading state

  useEffect(() => {
    fetch(urlCustomers)
      .then((response) => response.json())
      .then(async (data) => {
        try {
          const fetchMuteStatuses = await Promise.all(
            data.map(async (customer: Customer) => {
              const res = await fetch(`https://localhost:7192/api/MutedCustomer/select_muted_customers_with_customer_id-via-function?CustomerId=${customer.customerId}`);
              const muteData = await res.json();
              return { ...customer, isMuted: muteData.length > 0 };
            })
          );
          setCustomers(fetchMuteStatuses);
        } catch (error) {
          console.error('Error fetching mute statuses:', error);
        }
      })
      .catch((error) => console.error('Error fetching customers:', error));
  }, []);

  const handleDelete = (customerId: number) => {
    fetch(`https://localhost:7192/api/Customer/remove-customer-by-id?Id=${customerId}`, {
      method: 'DELETE',
    })
      .then((response) => {
        if (response.ok) {
          setCustomers(customers.filter((customer) => customer.customerId !== customerId));
        } else {
          console.error('Error deleting customer');
        }
      })
      .catch((error) => console.error('Error deleting customer:', error));
  };

  const handleMute = (customerId: number) => {
    const whyMutedDescription = prompt("Enter reason for muting this customer:");
    if (!whyMutedDescription) {
      alert("Muting reason is required.");
      return;
    }

    fetch(`https://localhost:7192/api/MutedCustomer/procedure-add-muted-customer?CustomerId=${customerId}&WhyMutedDescription=${encodeURIComponent(whyMutedDescription)}`, {
      method: 'POST',
    })
      .then((response) => {
        if (response.ok) {
          setCustomers(customers.map((customer) =>
            customer.customerId === customerId ? { ...customer, isMuted: true } : customer
          ));
          alert('Customer muted successfully');
        } else {
          console.error('Error muting customer');
        }
      })
      .catch((error) => console.error('Error muting customer:', error));
  };

  const handleUnmute = async (customerId: number) => {
    try {
        const response = await fetch(`https://localhost:7192/api/MutedCustomer/procedure-remove-muted-customer?CustomerId=${customerId}`, {
            method: 'POST'  
        });
        if (response.ok) {
            setCustomers(customers.map((customer) =>
                customer.customerId === customerId ? { ...customer, isMuted: false } : customer
            ));
            alert('Customer successfully unmuted.');
        } else {
            console.error('Error unmuting customer');
        }
    } catch (error) {
        console.error('Error unmuting customer:', error);
    }
  };

  const fetchReviews = async (id: number) => {
    try {
      const response = await axios.get(`https://localhost:7192/api/Review/select-review-from-customer-via-function?CustomerId=${id}`);
      console.log("Fetched Reviews:", response.data); // API'den gelen yanıtı kontrol edin
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
          CustomerId: selectedCustomer,  // Sending the selectedCustomer ID
          ProductId: productId
        }
      });
      setReviews(reviews.filter(review => review.reviewId !== reviewId)); // Update the reviews list
    } catch (error) {
      console.error("Error deleting review:", error);
      setError("Error deleting review. Please try again.");
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

   const handleToggleDetails = (customerId: number) => {
    if (selectedCustomer === customerId) {
      setSelectedCustomer(null); // Hide details if already open
    } else {
      setSelectedCustomer(customerId);
      fetchReviews(customerId); // Fetch reviews when expanding customer details
    }
  };

  return (
    <>
      <h1>Customer List</h1>
      <div className="customers-table-container">
        <table className="customers-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>First Name</th>
              <th>Last Name</th>
              <th>Email</th>
              <th>Created At</th>
              <th>Updated At</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {customers
              .filter((customer) => customer.customerId !== 10) // Admin User
              .map((customer) => (
                <React.Fragment key={customer.customerId}>
                  <tr>
                    <td>{customer.customerId}</td>
                    <td>{customer.customerFirstName}</td>
                    <td>{customer.customerLastName}</td>
                    <td>{customer.customerEmail}</td>
                    <td>{new Date(customer.createdAt).toLocaleString()}</td>
                    <td>{new Date(customer.updatedAt).toLocaleString()}</td>
                    <td>
                      <button onClick={() => handleDelete(customer.customerId)}>Delete</button>
                      {customer.isMuted ? (
                        <button onClick={() => handleUnmute(customer.customerId)}>Unmute</button>
                      ) : (
                        <button onClick={() => handleMute(customer.customerId)}>Mute</button>
                      )}
                      <button onClick={() => handleToggleDetails(customer.customerId)}>Customer Details</button>
                    </td>
                  </tr>
                  {selectedCustomer === customer.customerId && (
                    <tr>
                      <td colSpan={7}>
                        <div>
                          <h3>Customer Reviews</h3>
                          {reviews.length === 0 ? (
                            <p>No reviews available for this customer.</p>
                          ) : (
                            <ul>
                              {reviews.map((review, index) => (
                                <li key={index}>
                                  <h4>Product: {review.productName}</h4>
                                  <div>Rating: {renderStarsFromRating(review.rating)}</div>
                                  <p>Comment: {review.comment}</p>
                                  <p>Date: {new Date(review.createdAt).toLocaleDateString()}</p>
                                  <button onClick={() => deleteReview(review.reviewId, review.productId)}>
                                    Delete Review
                                  </button>
                                </li>
                              ))}
                            </ul>
                          )}
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
export default Customers;