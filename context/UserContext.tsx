"use client";

import {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useState,
    type ReactNode,
} from "react";
import { handleWhoami } from "@/lib/actions/auth-action";

export interface User {
    id?: string;
    firstName: string;
    lastName: string;
    username: string;
    email: string;
    profilePicture?: string | null;
    [key: string]: unknown;
}

interface UserContextValue {
    user: User | null;
    isLoading: boolean;
    setUser: (user: User | null) => void;
    //Re-fetch the current user from the API (e.g. after login or a profile update)
    refreshUser: () => Promise<void>;
}

const UserContext = createContext<UserContextValue | undefined>(undefined);

export function UserProvider({
    children,
    initialUser = null,
}: {
    children: ReactNode;
    //Optional value to seed the context with (e.g. from a server component) to avoid a loading flash.
    initialUser?: User | null;
}) {
    const [user, setUser] = useState<User | null>(initialUser);
    const [isLoading, setIsLoading] = useState(initialUser === null);

    const refreshUser = useCallback(async () => {
        setIsLoading(true);
        try {
            const result = await handleWhoami();
            setUser(result.success ? (result.data as User) : null);
        } catch {
            setUser(null);
        } finally {
            setIsLoading(false);
        }
    }, []);

    // Hydrate the context on first mount 
    // The httpOnly auth cookie isn't readable from the client, so we go through
    // the server action which reads it server-side and calls /auth/whoami 
    useEffect(() => {
        if (initialUser === null) {
            refreshUser();
        } else {
            setIsLoading(false);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <UserContext.Provider value={{ user, isLoading, setUser, refreshUser }}>
            {children}
        </UserContext.Provider>
    );
}

export function useUser() {
    const ctx = useContext(UserContext);
    if (!ctx) {
        throw new Error("useUser must be used within a <UserProvider>");
    }
    return ctx;
}
