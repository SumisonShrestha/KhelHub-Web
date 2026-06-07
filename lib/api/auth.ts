import { API } from "./endpoints";
import { LoginFormData, RegisterFormData } from "@/app/(auth)/_components/schema";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8088";

export const register = async (data: RegisterFormData) => {
    const res = await fetch(`${BASE_URL}${API.AUTH.REGISTER}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.message || "Registration failed");
    return json;
};

export const login = async (data: LoginFormData) => {
    const res = await fetch(`${BASE_URL}${API.AUTH.LOGIN}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.message || "Login failed");
    return json;
};