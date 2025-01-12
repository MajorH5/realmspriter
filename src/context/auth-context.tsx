import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { User } from "@/types/user-types";
import { authLogin, LoginResult, authLogout, authVerification } from "@/api/auth-api";
import { usersMe, usersRegister } from "@/api/users-api";
import { APIResponse } from "@/api/api";
import ReCAPTCHA from "react-google-recaptcha";

interface AuthContextType {
    user: User | null,
    logout: () => void;
    login: (email: string, password: string, captcha: ReCAPTCHA) => Promise<LoginResult>;
    isPerformingAuthEvent: boolean;
    register: (username: string, email: string, password: string, captcha: ReCAPTCHA) => Promise<APIResponse<User | null>>;
    resendVerificationEmail: () => Promise<APIResponse<null> | null>;
    sendingEmail: boolean;
    emailSent: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [sendingEmail, setSendingEmail] = useState(false);
    const [emailSent, setEmailSent] = useState(false);

    const [isLoggingIn, setIsLoggingIn] = useState(false);
    const [isSigningUp, setIsSigningUp] = useState(false);

    const isPerformingAuthEvent = useMemo(() => isLoggingIn || isSigningUp, [isLoggingIn, isSigningUp]);

    useEffect(() => {
        refreshUser();
    }, []);

    const refreshUser = () => {
        if (isLoggingIn) return;

        setIsLoggingIn(true);
        usersMe()
            .then((result) => {
                if (result.success && result.data !== null
                    && user === null && !isPerformingAuthEvent
                ) {
                    setUser(result.data);
                }
            }).finally(() => {
                setIsLoggingIn(false);
            });
    };

    const login = async (email: string, password: string, captcha: ReCAPTCHA): Promise<LoginResult> => {
        setIsLoggingIn(true);
        
        const token = captcha.getValue() || await captcha.executeAsync();
        
        if (token === null) {
            setIsLoggingIn(false);

            return {
                message: "Captcha failed",
                success: false,
                data: null
            };
        }

        return authLogin(email, password)
            .then((response) => {
                if (response.success && response.data !== null) {
                    setEmailSent(false);
                    setUser(response.data.user);
                }
                setIsLoggingIn(false);
                return response;
            });
    };

    const logout = async () => {
        return authLogout()
            .then((response) => {
                setEmailSent(false);
                setUser(null);
                return response;
            });
    };
    
    const register = async (email: string, username: string, password: string, captcha: ReCAPTCHA): Promise<APIResponse<User | null>> => {
        setIsSigningUp(true);
        
        const token = captcha.getValue() || await captcha.executeAsync();

        if (token === null) {
            setIsSigningUp(false);

            return {
                message: "Captcha failed",
                success: false,
                data: null
            };
        }

        return usersRegister(email, username, password).then((result) => {
            if (result.success) {
                setUser(result.data);
            }

            setIsSigningUp(false);
            
            return result;
        });
    };

    const resendVerificationEmail = async () => {
        if (user === null) {
            return null;
        }

        setSendingEmail(true);

        return authVerification("resend")
            .then((result) => {
                setEmailSent(result.success);
                setSendingEmail(false);
                return result;
            });
    };

    return (
        <AuthContext.Provider value={{
            user, login, logout, register, isPerformingAuthEvent,
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