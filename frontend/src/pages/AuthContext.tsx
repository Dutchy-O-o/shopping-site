import React, { createContext, useState, useContext } from "react";

// Define the shape of the AuthContext
interface AuthContextType {
  user: any; // Replace `any` with your user data type
  login: (userData: any) => void;
  logout: () => void;
}

// Create AuthContext with a default value of `null`
const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<any>(null); // Replace `any` with your user data type

  const login = (userData: any) => {
    setUser(userData);
    localStorage.setItem("authToken", userData.token); // Save the token for authenticated requests
    localStorage.setItem("customerId", userData.customerId); // Save customerId
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("authToken");
    localStorage.removeItem("customerId"); // Clear customerId
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
