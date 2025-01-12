import { User, Session } from "@/types/user-types";
import { APIResponse, api, encodeParams } from "./api";

export type LoginResult = APIResponse<{ session: Session; user: User; } | null>
export async function authLogin(email: string, password: string): Promise<LoginResult> {
    return api("auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
    });
};

export async function authLogout(): Promise<APIResponse<null>> {
    return api("auth/logout", { method: "GET" });
};

export type VerificationAction = "resend" | "verify";
export async function authVerification(action: VerificationAction, otp?: string, redirect?: string): Promise<APIResponse<null>> {
    const params: Record<string, string> = { action: action };

    if (otp) params.rsp_otp = otp;
    if (redirect) params.redirect = redirect;

    const queryParams = encodeParams(params);

    return api(`auth/verification?${queryParams}`, { method: "GET" });
};

