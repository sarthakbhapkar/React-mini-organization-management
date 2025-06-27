import axios from 'axios';

const API_BASE = 'http://localhost:3000';

export const api = {
    get: <T>(url: string, token?: string | null ) =>
        axios.get<T>(`${API_BASE}${url}`, {
            headers: { Authorization: `Bearer ${token}` },
        }),

    post: <T>(url: string, data?: T, token?: string | null) =>
        axios.post<T>(`${API_BASE}${url}`, data, {
            headers: { Authorization: `Bearer ${token}`},
        }),

    put: <T>(url: string, data?: T, token?: string | null) =>
        axios.put<T>(`${API_BASE}${url}`, data, {
            headers: { Authorization: `Bearer ${token}`},
        })
};
