import { User } from "@/types/user-types";
import { api, APIResponse } from "./api";

export async function usersMe(): Promise<APIResponse<User>> {
    return api("users/me", { method: "GET" });
};

export async function usersRegister (email: string, username: string, password: string): Promise<APIResponse<User | null>> {
    return api("users/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, username, password })
    });
};
