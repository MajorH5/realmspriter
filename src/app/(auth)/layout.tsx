"use client";

import { AuthProvider } from "@/context/auth-context";

export default function Authenticated({ children }: { children: React.ReactNode }) {
    return (
        <>
            <AuthProvider>
                {children}
            </AuthProvider>
        </>
    );
}
