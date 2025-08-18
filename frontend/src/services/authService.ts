import axios from "axios";

const RAW = import.meta.env.VITE_API_URL || "http://localhost:10000";
const BASE = RAW.replace(/\/+$/, "");
const API_URL = `${BASE}/auth`;

export interface TokenResponse { access_token: string; token_type: string } // ignore in .js

export const register = async (username: string, password: string) => {
  const res = await axios.post<TokenResponse>(`${API_URL}/register`, { username, password });
  return res.data;
};

export const login = async (username: string, password: string) => {
  const res = await axios.post<TokenResponse>(`${API_URL}/login`, { username, password });
  return res.data;
};
