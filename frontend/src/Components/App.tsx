import React, { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import HomePage from '../pages/HomePage';
import AdminLog from '../pages/AdminLog';
import SignupOrLogin from '../pages/SignUpOrLogin';
import ProductDetails from '../pages/ProductDetails';
import Cart from '../pages/Cart';
import Checkout from '../pages/Checkout';
import ContactUs from '../pages/ContactUs';
import Navbar from './Navbar';
import Profile from '../pages/Profile';
import '../Styles/index.css';
import '../Styles/App.css';

const App: React.FC = () => {
    const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
    const [admin, setAdmin] = useState<boolean>(false);

    // Check login and admin status on component mount
    useEffect(() => {
        const token = localStorage.getItem("authToken");
        const role = localStorage.getItem("role");

        setIsLoggedIn(!!token);
        // Admin status comes from the role claim returned by the backend,
        // not from a hard-coded user id.
        setAdmin(role === "Admin");
    }, []);

    return (
        <>
            {isLoggedIn && <Navbar isLoggedIn={isLoggedIn} admin={admin} />}
            <Routes>
                <Route path="/signup-or-login" element={<SignupOrLogin setIsLoggedIn={setIsLoggedIn} />} />
                {isLoggedIn && (
                    <>
                        <Route path="/" element={<HomePage />} />
                        {admin && <Route path="/customers" element={<AdminLog />} />}
                        <Route path="/product-details/:productId" element={<ProductDetails />} />
                        <Route path="/cart" element={<Cart />} />
                        <Route path="/checkout" element={<Checkout />} />
                        <Route path="/contact-us" element={<ContactUs />} />
                        <Route path="/profile" element={<Profile setIsLoggedIn={setIsLoggedIn} />} />
                    </>
                )}
                <Route path="*" element={!isLoggedIn ? <SignupOrLogin setIsLoggedIn={setIsLoggedIn} /> : <HomePage />} />
            </Routes>
        </>
    );
};

export default App;
