import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../Styles/Login.css';
import jwt_decode from 'jwt-decode';


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
            const url = `https://localhost:7192/api/Customer/procedure-sign-up?CustomerFirstName=${customerFirstName}&CustomerLastName=${customerLastName}&CustomerEmail=${customerEmail}&PasswordHash=${passwordHash}`;
            
            try {
                const response = await axios.post(url, null, {
                    headers: { 'Content-Type': 'application/json' }
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
                const response = await axios.post("https://localhost:7192/api/Auth/login", {
                    email: customerEmail,
                    password: passwordHash,
                });
        
                const { token } = response.data;
                if (!token) {
                    setMessage("No token received from the server.");
                    return;
                }

                // Decode the token to get user data
                const decodedToken: any = jwt_decode(token);  // Correct usage of jwt_decode
                const userId = decodedToken["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"];
                if (!userId) {
                    setMessage("User ID not found in token.");
                    return;
                }
        
                localStorage.setItem("authToken", token);
                localStorage.setItem("userId", userId);

                // Check if the user is an admin (assuming admin ID is 10)
                if (userId === 10) {
                    setAdmin(true);
                    console.log(admin);
                }
                else{
                    setAdmin(false);
                    console.log(admin);
                }

                window.location.reload();
                
                setUserId(userId);
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
            setIsLoggedInLocal(false);
            setIsLoggedIn(false);
            setUserId(null); // Clear the userId from the state
            setMessage("Logged out successfully.");
        };

        axios.interceptors.request.use((config) => {
            const token = localStorage.getItem("authToken");
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
            return config;
        });

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

