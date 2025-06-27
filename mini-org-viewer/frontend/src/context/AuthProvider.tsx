import React, { useEffect, useState } from "react";
import axios from "axios";
import { AuthContext } from "./AuthContext";
import type {User} from "../types"

const API_BASE = 'http://localhost:3000';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(localStorage.getItem('token'));

    useEffect(() => {
        if (token) {
            axios
                .get(`${API_BASE}/api/auth/me`, {
                    headers: { authorization: `Bearer ${token}` },
                })
                .then((res) => setUser(res.data.data))
                .catch(() => logout());
        }
    }, [token]);

    const login = async (email: string, password: string) => {
        const res = await axios.post(`${API_BASE}/api/auth/login`, { email, password });
        const receivedToken = res.data.data.token;
        console.log("Received Token:", receivedToken);
        setToken(receivedToken);
        localStorage.setItem('token', receivedToken);

        const userRes = await axios.get(`${API_BASE}/api/auth/me`, {
            headers: { authorization: `Bearer ${receivedToken}` },
        });
        setUser(userRes.data.data);
    };

    const logout = () => {
        setUser(null);
        setToken(null);
        localStorage.removeItem('token');
    };

    return (
        <AuthContext.Provider value={{ user, token, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
