import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import type { LoginCredentials, User } from '../types/auth';
import { dispatchAuthEvent } from '../App';

const API_URL = import.meta.env.VITE_API_BASE_URL;

interface AuthResponse {
  success: boolean;
  token?: string;
  error?: string;
}

// Mock user data
const MOCK_USER = {
  email: "demo@vibepilot.com",
  password: "demo1234",
  name: "Alex Johnson",
  role: "Account Administrator",
};

// Mock JWT token (for demo purposes only)
const MOCK_TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkFsZXggSm9obnNvbiIsImVtYWlsIjoiZGVtb0B2aWJlcGlsb3QuY29tIiwicm9sZSI6IkFjY291bnQgQWRtaW5pc3RyYXRvciIsImlhdCI6MTUxNjIzOTAyMn0.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c";

// Token key for localStorage
const TOKEN_KEY = "vibepilot_auth_token";

/**
 * Safely access localStorage with fallback
 */
const safeLocalStorage = {
  getItem: (key: string): string | null => {
    try {
      return localStorage.getItem(key);
    } catch (e) {
      console.error('Error accessing localStorage:', e);
      return null;
    }
  },
  setItem: (key: string, value: string): void => {
    try {
      localStorage.setItem(key, value);
    } catch (e) {
      console.error('Error writing to localStorage:', e);
    }
  },
  removeItem: (key: string): void => {
    try {
      localStorage.removeItem(key);
    } catch (e) {
      console.error('Error removing from localStorage:', e);
    }
  }
};

/**
 * Safely access sessionStorage with fallback
 */
const safeSessionStorage = {
  getItem: (key: string): string | null => {
    try {
      return sessionStorage.getItem(key);
    } catch (e) {
      console.error('Error accessing sessionStorage:', e);
      return null;
    }
  },
  setItem: (key: string, value: string): void => {
    try {
      sessionStorage.setItem(key, value);
    } catch (e) {
      console.error('Error writing to sessionStorage:', e);
    }
  },
  removeItem: (key: string): void => {
    try {
      sessionStorage.removeItem(key);
    } catch (e) {
      console.error('Error removing from sessionStorage:', e);
    }
  }
};

/**
 * Simulates a login API call
 * @param credentials User login credentials
 * @returns Promise with auth response
 */
export const login = async (credentials: LoginCredentials): Promise<AuthResponse> => {
  console.log("Auth service login called with:", credentials);
  // Simulate API delay
  return new Promise((resolve) => {
    setTimeout(() => {
      try {
        // Check if credentials match mock user (demo account)
        if (credentials.email === MOCK_USER.email && credentials.password === MOCK_USER.password) {
          console.log("Credentials match, logging in");
          
          // Store token in safe storage
          const storage = credentials.rememberMe ? safeLocalStorage : safeSessionStorage;
          storage.setItem(TOKEN_KEY, MOCK_TOKEN);
          
          // Dispatch auth change event
          dispatchAuthEvent(true);
          
          console.log("Login successful, token stored, auth event dispatched");
          resolve({ success: true, token: MOCK_TOKEN });
        } else {
          console.log("Invalid credentials");
          resolve({ success: false, error: 'Invalid email or password' });
        }
      } catch (error) {
        console.error("Error during login:", error);
        resolve({ success: false, error: 'An error occurred during login' });
      }
    }, 800); // Simulate network delay
  });
};

/**
 * Checks if user is authenticated
 * @returns boolean indicating if user has a valid token
 */
export const isAuthenticated = (): boolean => {
  const token = safeLocalStorage.getItem(TOKEN_KEY) || safeSessionStorage.getItem(TOKEN_KEY);
  console.log("isAuthenticated check - token exists:", !!token);
  return !!token;
};

/**
 * Logs out the user by removing the token
 */
export const logout = (): void => {
  console.log("Logging out - removing tokens");
  safeLocalStorage.removeItem(TOKEN_KEY);
  safeSessionStorage.removeItem(TOKEN_KEY);
};

/**
 * Gets the current auth token
 * @returns The current auth token or null
 */
export const getToken = (): string | null => {
  return safeLocalStorage.getItem(TOKEN_KEY) || safeSessionStorage.getItem(TOKEN_KEY);
};

export default {
  login,
  isAuthenticated,
  logout,
  getToken
};