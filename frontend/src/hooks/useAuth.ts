import { useState, useEffect } from 'react';
import * as authService from '../services/authService';

interface TokenResponse {
  access_token: string;
  token_type: string;
}

export const useAuth = () => {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('token'));
  const [user, setUser] = useState<any>(null); // later replace with User type if needed

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (storedToken && !token) {
      setToken(storedToken);
      // optionally: fetch user info here
    }
  }, []);

  const saveToken = (token: string) => {
    localStorage.setItem('token', token);
    setToken(token);
  };

  const register = async (username: string, password: string): Promise<void> => {
    const data: TokenResponse = await authService.register(username, password);
    saveToken(data.access_token);
  };

  const login = async (username: string, password: string): Promise<void> => {
    const data: TokenResponse = await authService.login(username, password);
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
