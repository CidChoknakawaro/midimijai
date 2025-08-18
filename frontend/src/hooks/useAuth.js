import { useState, useEffect } from 'react';
import * as authService from '../services/authService';
export const useAuth = () => {
    const [token, setToken] = useState(() => localStorage.getItem('token'));
    const [user, setUser] = useState(null); // later replace with User type if needed
    useEffect(() => {
        const storedToken = localStorage.getItem('token');
        if (storedToken && !token) {
            setToken(storedToken);
            // optionally: fetch user info here
        }
    }, []);
    const saveToken = (token) => {
        localStorage.setItem('token', token);
        setToken(token);
    };
    const register = async (username, password) => {
        const data = await authService.register(username, password);
        saveToken(data.access_token);
    };
    const login = async (username, password) => {
        const data = await authService.login(username, password);
        saveToken(data.access_token);
    };
    const logout = () => {
        localStorage.removeItem('token');
        setToken(null);
        setUser(null);
    };
    const isLoggedIn = !!token;
    return { token, user, isLoggedIn, login, register, logout };
};
