import React, { useState, useEffect } from 'react';
import api from '../api/client';
import '../Styles/Login.css';


    export function SignUpOrLogin({ setIsLoggedIn }: { setIsLoggedIn: (value: boolean) => void }) {
        const [customerFirstName, setCustomerFirstName] = useState('');
        const [customerLastName, setCustomerLastName] = useState('');
        const [customerEmail, setCustomerEmail] = useState('');
        const [passwordHash, setPasswordHash] = useState('');
        const [message, setMessage] = useState('');
        const [isSignUp, setIsSignUp] = useState(false);
        const [isLoggedIn, setIsLoggedInLocal] = useState(false);
        const [userId, setUserId] = useState<string | null>(null); // State to track userId

        const [admin, setAdmin] = useState<boolean>(false);

        useEffect(() => {
            const token = localStorage.getItem("authToken");
            const storedUserId = localStorage.getItem("userId"); // Check userId from localStorage
            if (token) {
                setIsLoggedInLocal(true);
                setIsLoggedIn(true);
                setUserId(storedUserId);  // Set the userId in the state
            }
        }, [setIsLoggedIn, isLoggedIn]);

        const handleSignUp = async () => {
            try {
                // Password is sent in the request body (never in the URL/query string).
                await api.post("/api/Customer/procedure-sign-up", {
                    customerFirstName,
                    customerLastName,
                    customerEmail,
                    passwordHash,
                });
                alert("Customer signed up successfully!");
            } catch (error: any) {
                console.error("Sign up error:", error);
                const errorMessage = error.response?.data?.message || "An error occurred.";
                alert(errorMessage);
            }
        };

        const handleLogin = async () => {
            try {
                const response = await api.post("/api/Auth/login", {
                    email: customerEmail,
                    password: passwordHash,
                });

                const { token, userId: loginUserId, role } = response.data;
                if (!token) {
                    setMessage("No token received from the server.");
                    return;
                }

                // The backend now returns the user id and role directly, so we no
                // longer need to decode the token or hard-code an admin id.
                localStorage.setItem("authToken", token);
                localStorage.setItem("userId", String(loginUserId));
                localStorage.setItem("role", role);

                setAdmin(role === "Admin");

                window.location.reload();

                setUserId(String(loginUserId));
                setIsLoggedInLocal(true);
                setIsLoggedIn(true);
                setMessage("Logged in successfully!");
            } catch (error) {
                console.error(error); // Log the error
                setMessage("Login failed. Please check your credentials.");
            }
        };
        
    
        
        const handleLogout = () => {
            localStorage.removeItem("authToken");
            localStorage.removeItem("userId");
            localStorage.removeItem("role");
            setIsLoggedInLocal(false);
            setIsLoggedIn(false);
            setUserId(null); // Clear the userId from the state
            setMessage("Logged out successfully.");
        };

        return (
            <div className="signUpContainer">
                <div className="form-tabs">
                    <button className={!isSignUp ? 'active-tab' : ''} onClick={() => setIsSignUp(false)}>Login</button>
                    <button className={isSignUp ? 'active-tab' : ''} onClick={() => setIsSignUp(true)}>Sign Up</button>
                </div>

                {isLoggedIn ? (
                    <div className="loggedInView">
                        <h1>Welcome!</h1>
                        <p>You are logged in as {customerEmail}</p>
                        <p><strong>User ID:</strong> {userId || "Not Found"}</p> {/* Debugging UserId */}
                        <button onClick={handleLogout}>Logout</button>
                        <p>{message}</p>
                    </div>
                ) : (
                    isSignUp ? (
                        <div className="signUpForm">
                               <h1>Sign Up</h1>
                            <input type="text" placeholder="First Name" value={customerFirstName} onChange={(e) => setCustomerFirstName(e.target.value)} />
                            <input type="text" placeholder="Last Name" value={customerLastName} onChange={(e) => setCustomerLastName(e.target.value)} />
                            <input type="email" placeholder="Email" value={customerEmail} onChange={(e) => setCustomerEmail(e.target.value)} />
                            <input type="password" placeholder="Password" value={passwordHash} onChange={(e) => setPasswordHash(e.target.value)} />
                            <button onClick={handleSignUp}>Sign Up</button>
                            <p>{message}</p>
                        </div>
                    ) : (
                        <div className="signUpForm">
                            <h1>Login</h1>
                            <input type="email" placeholder="Email" value={customerEmail} onChange={(e) => setCustomerEmail(e.target.value)} />
                            <input type="password" placeholder="Password" value={passwordHash} onChange={(e) => setPasswordHash(e.target.value)} />
                            <button onClick={handleLogin}>Login</button>
                            <p>{message}</p>
                        </div>
                    )
                )}
            </div>
        );
    }

    export default SignUpOrLogin;

