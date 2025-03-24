import React, { createContext, useState, useContext, useEffect } from 'react';

interface AuthUser {
  id: string;
  name: string;
  email: string;
  token: string;
}

interface AuthContextProps {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextProps>({
  user: null,
  isAuthenticated: false,
  isLoading: false,
  login: async () => {},
  logout: () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Mock of authentication flow
  useEffect(() => {
    // Check for saved token in localStorage
    const savedToken = localStorage.getItem('auth_token');
    
    if (savedToken) {
      // In a real app, validate the token with your backend
      setUser({
        id: '1',
        name: 'Demo User',
        email: 'user@example.com',
        token: savedToken,
      });
    }
    
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    
    try {
      // Mock of login API call
      // In a real app, this would be an actual API call to your backend
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockUser = {
        id: '1',
        name: 'Demo User',
        email,
        token: 'mock_jwt_token',
      };
      
      localStorage.setItem('auth_token', mockUser.token);
      setUser(mockUser);
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('auth_token');
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;