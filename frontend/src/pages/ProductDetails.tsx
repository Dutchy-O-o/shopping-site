import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import '../Styles/ProductsPage.css';

interface Product {
  productId: number;
  productName: string;
  description: string;
  price: number;
  stockQuantity: number;
  categoryId: number;
  alt_url: string;
  createdAt: string;
  updatedAt: string;
  gender: string;
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

const ProductDetails = () => {
  const { productId } = useParams<{ productId: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [newReview, setNewReview] = useState({
    rating: 5,
    comment: ""
  });

  const [isEditing, setIsEditing] = useState(false);
  const [editedProduct, setEditedProduct] = useState<Product | null>(product);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(
          `https://localhost:7192/api/Product/get-product-by-id?Id=${productId}`
        );
        setProduct(response.data);
        setLoading(false);
      } catch (error) {
        setError("Product not found. Please try again.");
        setLoading(false);
      }
    };

    const fetchReviews = async () => {
      try {
        const response = await axios.get(
          `https://localhost:7192/api/Review/select-all-reviews_join_customers-via-function`
        );
        const filteredReviews = response.data.filter((review: Review) => review.productId === Number(productId));
        setReviews(filteredReviews);
      } catch (error) {
        console.error("Failed to fetch reviews.", error);
      }
    };

    if (productId) {
      fetchProduct();
      fetchReviews();
    }
  }, [productId]);
  
  const storedUserId = localStorage.getItem("userId");
  const customerId = storedUserId ? parseInt(storedUserId) : undefined;
  const handleAddReview = async () => {
    if (!customerId) {
      alert("You must be logged in to submit a review.");
      return;
    }
  
    try {
      await axios.post(
        `https://localhost:7192/api/Review/procedure-add-review?ProductId=${productId}&CustomerId=${customerId}&Rating=${newReview.rating}&Comment=${newReview.comment}`
      );
      alert("Review added successfully!");
      setNewReview({ rating: 5, comment: "" });
      window.location.reload();
    } catch (error) {
      console.error("Failed to add review.", error);
      alert("Failed to add review.");
    }
  };
  

  // Correct way to handle image URL
  const imageUrl = product?.alt_url
    ? `/images/${product.alt_url.split('/').pop()}`
    : "/placeholder-image.png";

  // Handle star click to update rating
  const handleStarClick = (rating: number) => {
    setNewReview({ ...newReview, rating });
  };

  // Function to render stars based on a numeric rating
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

  const [shoppingCartId, setShoppingCartId] = useState<number | null>(null);

  useEffect(() => {
    const fetchShoppingCartId = async () => {
      try {
        const response = await axios.get(
          `https://localhost:7192/api/ShoppingCart/find-shopping_cart_id-using-customer_id-via-function?CustomerId=${customerId}`
        );
        const shoppingCartId = response.data[0]?.shoppingCartId;
        if (shoppingCartId) {
          setShoppingCartId(shoppingCartId);
        } else {
          console.error("No shopping cart found.");
        }
      } catch (error) {
        console.error("Failed to fetch shopping cart ID", error);
      }
    };
  
    if (customerId) {
      fetchShoppingCartId();
    }
  }, [customerId]);

  const handleAddToCart = async () => {
    if (!customerId || !shoppingCartId) {
      alert("You must be logged in and have a shopping cart to add items.");
      return;
    }
  
    try {
      await axios.post(
        `https://localhost:7192/api/ShoppingCartItem/procedure-add-shopping-cart-item?ShoppingCartId=${shoppingCartId}&ProductId=${productId}&Quantity=1`
      );
      alert("Product added to cart!");
    } catch (error) {
      console.error("Failed to add product to cart.", error);
      alert("Failed to add product to cart.");
    }
  };

  // Function to render stars for adding a new review
  const renderStars = () => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <span
          key={i}
          className={`star ${i <= newReview.rating ? "filled" : ""}`}
          onClick={() => handleStarClick(i)}
        >
          ★
        </span>
      );
    }
    return stars;
  };

  const handleEditClick = () => {
    setEditedProduct(product);
    setIsEditing(true);
  };
  
  const handleSaveChanges = async () => {
    if (!editedProduct) return;
    try {
      await axios.get(
        `https://localhost:7192/api/Product/update-product-via-function?ProductId=${productId}&ProductName=${editedProduct.productName}&Description=${editedProduct.description}&Price=${editedProduct.price}&StockQuantity=${editedProduct.stockQuantity}&Gender=${editedProduct.gender}`
      );
      alert("Product updated successfully!");
      setIsEditing(false);
      window.location.reload();
    } catch (error) {
      console.error("Failed to update product.", error);
      alert("Failed to update product.");
    }
  };

  return (
    <div className="products-container">
      <div className="product-card">
        <div className="product-image-container">
          {loading ? (
            <div>Loading Image...</div>
          ) : (
            <img
              src={imageUrl}
              alt={product?.productName}
              className="product-image"
            />
          )}
        </div>
        <div className="product-info">
          <h3 className="product-title">{product?.productName}</h3>
          <p className="product-description">{product?.description}</p>
          <div className="product-price">
            <strong>Price:</strong> ${product?.price}
          </div>
          <div className="product-stock">
            <strong>Stock:</strong> {product?.stockQuantity ?? 'Out of Stock'}
          </div>
          <div className="product-gender">
            <strong>Gender:</strong> {product?.gender}
          </div>
        </div>
        <div className="product-action">
          <button className="add-to-cart" onClick={handleAddToCart}>Add to Cart</button>
        
          {customerId === 10 && !isEditing && (
    <button 
        className="edit-product" 
        onClick={handleEditClick} 
        style={{ padding: "10px 150px", marginTop: "10px", fontSize: "16px" }}
    >
        Edit Product
    </button>
)}
  {isEditing && (
  <div className="edit-product-form-container">
    <div className="edit-product-form">
      <label>Product Name</label>
      <input
        type="text"
        value={editedProduct?.productName}
        onChange={(e) => setEditedProduct({ ...editedProduct!, productName: e.target.value })}
      />
      <label>Description</label>
      <textarea
        value={editedProduct?.description}
        onChange={(e) => setEditedProduct({ ...editedProduct!, description: e.target.value })}
      />
      <label>Price</label>
      <input
        type="number"
        value={editedProduct?.price}
        onChange={(e) => setEditedProduct({ ...editedProduct!, price: parseFloat(e.target.value) })}
      />
      <label>Stock Quantity</label>
      <input
        type="number"
        value={editedProduct?.stockQuantity}
        onChange={(e) => setEditedProduct({ ...editedProduct!, stockQuantity: parseInt(e.target.value) })}
      />
      <label>Gender</label>
      <select
        value={editedProduct?.gender}
        onChange={(e) => setEditedProduct({ ...editedProduct!, gender: e.target.value })}
      >
        <option value="Male">Male</option>
        <option value="Female">Female</option>
        <option value="Unisex">Unisex</option>
      </select>
      <button onClick={handleSaveChanges}>Save Changes</button>
      <button onClick={() => setIsEditing(false)}>Cancel</button>
    </div>
  </div>
)}
        </div>
      </div>
      <div className="product-reviews">
        <h3>Customer Reviews</h3>
        {reviews.length > 0 ? (
          reviews.map((review) => (
            <div key={review.reviewId} className="review">
              <p><strong>{review.customerFirstName} {review.customerLastName}</strong></p>
              <p>Rating: {renderStarsFromRating(review.rating)}</p>
              <p>Comment: {review.comment}</p>
              <p>Date: {new Date(review.createdAt).toLocaleDateString()}</p>
            </div>
          ))
        ) : (
          <p>No reviews available for this product.</p>
        )}
        <div className="add-review">
          <h3>Add a Review</h3>
          <div className="star-rating">
            {renderStars()}
          </div>
          <textarea
            value={newReview.comment}
            onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
            placeholder="Write your comment here..."
          />
          <button onClick={handleAddReview}>Submit Review</button>
        </div>
      </div>
    </div>
);

  

};

export default ProductDetails;
