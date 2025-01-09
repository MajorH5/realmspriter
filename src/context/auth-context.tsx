import { createContext, useContext, useState } from "react";
import { User } from "@/types/user-types";

interface AuthContextType {
    user: User | null,
    logout: () => void;
    login: (email: string, password: string) => Promise<User | null>;
    register: (username: string, email: string, password: string) => Promise<User | null>;
    resendVerificationEmail: () => Promise<boolean>;
    sendingEmail: boolean;
    emailSent: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<User | null>({
        email: "user@example.com",
        username: "username",
        accountVerified: false
    });
    const [sendingEmail, setSendingEmail] = useState(false);
    const [emailSent, setEmailSent] = useState(false);

    const login = (email: string, password: string): Promise<User | null> => {
        return new Promise((resolve, reject) => {
            const exampleUser = { email, username: "username", accountVerified: true };

            setUser(exampleUser);
            resolve(exampleUser);
        });
    };

    const logout = () => {
        setUser(null);
    };

    const register = (username: string, email: string, password: string): Promise<User | null> => {
        return new Promise((resolve, reject) => {
            const exampleUser = { email, username, accountVerified: false };

            setUser(exampleUser);
            resolve(exampleUser);
        })
    };

    const resendVerificationEmail = async (): Promise<boolean> => {
        if (user === null) {
            return false;
        }

        setSendingEmail(true);

        return new Promise((resolve, reject) => {
            setTimeout(() => {
                resolve(true);
                setEmailSent(true);
                setSendingEmail(false);
            }, 1000);
        });
    };

    return (
        <AuthContext.Provider value={{
            user, login, logout, register,
            resendVerificationEmail, sendingEmail, emailSent
        }}>
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