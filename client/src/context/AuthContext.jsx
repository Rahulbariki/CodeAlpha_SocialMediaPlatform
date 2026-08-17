import React, { createContext, useState, useContext } from 'react';
import API from '../api/axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('social_userInfo');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [loading, setLoading] = useState(false);

  const login = async (email, password) => {
    setLoading(true);
    try {
      const { data } = await API.post('/auth/login', { email, password });
      setUser(data);
      localStorage.setItem('social_token', data.token);
      localStorage.setItem('social_userInfo', JSON.stringify(data));
      setLoading(false);
      return { success: true, data };
    } catch (error) {
      setLoading(false);
      return {
        success: false,
        message: error.response?.data?.message || 'Login failed'
      };
    }
  };

  const register = async (name, username, email, password, bio, avatar) => {
    setLoading(true);
    try {
      const { data } = await API.post('/auth/register', { name, username, email, password, bio, avatar });
      setUser(data);
      localStorage.setItem('social_token', data.token);
      localStorage.setItem('social_userInfo', JSON.stringify(data));
      setLoading(false);
      return { success: true, data };
    } catch (error) {
      setLoading(false);
      return {
        success: false,
        message: error.response?.data?.message || 'Registration failed'
      };
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('social_token');
    localStorage.removeItem('social_userInfo');
  };

  const updateUser = (updatedData) => {
    const newUser = { ...user, ...updatedData };
    setUser(newUser);
    localStorage.setItem('social_userInfo', JSON.stringify(newUser));
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
