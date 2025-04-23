import axios from 'axios';

const API_URL = 'http://localhost:8000/auth';

export interface TokenResponse {
  access_token: string;
  token_type: string;
}

export const register = async (username: string, password: string): Promise<TokenResponse> => {
  const res = await axios.post<TokenResponse>(`${API_URL}/register`, { username, password });
  return res.data;
};

export const login = async (username: string, password: string): Promise<TokenResponse> => {
  const res = await axios.post<TokenResponse>(`${API_URL}/login`, { username, password });
  return res.data;
};
