export type Session = {
    sid: string;
    stkn: string;
    meta: {
        iat: number;
        eat: number;
    };
};

export type User = {
    id: number;
    username: string;
    email: string;
    email_verified: boolean;
    is_admin: boolean;
    is_banned: boolean;
    registration_ip: string;
    created_at: string;
};
