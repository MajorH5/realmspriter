import { createContext, useContext, useState } from "react";
import { User } from "@/types/user-types";

interface AuthContextType {
    user: User | null,
    logout: () => void;
    login: (email: string, password: string) => Promise<User | null>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<User | null>({
        email: "user@example.com",
        username: "username"
    });

    const login = (email: string, password: string): Promise<User> => {
        return new Promise((resolve, reject) => {
            const exampleUser = { email, username: "username" };

            setUser(exampleUser);
            resolve(exampleUser);
        });
    };

    const logout = () => {
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => {
    const context = useContext(AuthContext);

    if (!context) {
        throw new Error("useAuth can only be called inside of an AuthProvider");
    }

    return context;
}