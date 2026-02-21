export type UserRole = "ADMIN" | "USER";

export interface User {
    id: string;
    username: string;
    nombre?: string;
    apellido?: string;
    email?: string;
    puesto?: string;
    role: UserRole;
}

export interface AuthResponse {
    token: string;
    user: User;
}

export interface LoginRequest {
    username: string;
    password: string;
}

export interface AuthContextType {
    user: User | null;
    token: string | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    login: (username: string, password: string) => Promise<void>;
    logout: () => void;
}

