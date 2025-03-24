import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import type { LoginCredentials, User } from '../types/auth';

const API_URL = import.meta.env.VITE_API_BASE_URL;

export const authService = {
  async login(credentials: LoginCredentials) {
    const response = await axios.post(`${API_URL}/auth/login`, credentials);
    const { token } = response.data;
    
    if (token) {
      localStorage.setItem('token', token);
      return token;
    }
    throw new Error('Authentication failed');
  },

  logout() {
    localStorage.removeItem('token');
  },

  getCurrentUser(): User | null {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded = jwtDecode<User>(token);
        return decoded;
      } catch (error) {
        console.error('Error decoding token:', error);
        return null;
      }
    }
    return null;
  },

  getToken(): string | null {
    return localStorage.getItem('token');
  },

  isAuthenticated(): boolean {
    const token = this.getToken();
    if (!token) return false;
    
    try {
      const decoded = jwtDecode<{ exp: number }>(token);
      return decoded.exp * 1000 > Date.now();
    } catch {
      return false;
    }
  }
};