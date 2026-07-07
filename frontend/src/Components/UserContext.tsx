import React, { createContext, useContext, useState, ReactNode } from "react";

interface UserContextType {
    userId: string | null;
    isLoggedIn: boolean;
    setUserId: (userId: string) => void;
    setIsLoggedIn: (status: boolean) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

interface UserProviderProps {
    children: ReactNode;
}

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
    const [userId, setUserId] = useState<string | null>(localStorage.getItem("userId"));
    const [isLoggedIn, setIsLoggedIn] = useState<boolean>(!!localStorage.getItem("authToken"));

    return (
        <UserContext.Provider value={{ userId, isLoggedIn, setUserId, setIsLoggedIn }}>
            {children}
        </UserContext.Provider>
    );
};

// Custom hook to use UserContext
export const useUser = () => {
    const context = useContext(UserContext);
    if (!context) {
        throw new Error("useUser must be used within a UserProvider");
    }
    return context;
};
