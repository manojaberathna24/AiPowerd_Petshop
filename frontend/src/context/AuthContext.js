import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../services/api';
import { toast } from 'react-toastify';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
        setLoading(false);
    }, []);

    const login = async (email, password) => {
        try {
            const { data } = await authAPI.login({ email, password });
            setUser(data);
            localStorage.setItem('user', JSON.stringify(data));
            // IMPORTANT: Store token separately for API requests
            if (data.token) {
                localStorage.setItem('token', data.token);
            }
            toast.success('Welcome back! 🎉');
            return { success: true };
        } catch (error) {
            const message = error.response?.data?.message || 'Login failed';
            toast.error(message);
            return { success: false, message };
        }
    };

    const register = async (name, email, password, phone) => {
        try {
            const { data } = await authAPI.register({ name, email, password, phone });
            setUser(data);
            localStorage.setItem('user', JSON.stringify(data));
            // IMPORTANT: Store token separately for API requests
            if (data.token) {
                localStorage.setItem('token', data.token);
            }
            toast.success('Account created successfully! 🎉');
            return { success: true };
        } catch (error) {
            const message = error.response?.data?.message || 'Registration failed';
            toast.error(message);
            return { success: false, message };
        }
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('user');
        localStorage.removeItem('token'); // Remove token too
        toast.info('Logged out successfully');
    };

    const updateUser = (userData) => {
        const updatedUser = { ...user, ...userData };
        setUser(updatedUser);
        localStorage.setItem('user', JSON.stringify(updatedUser));
    };

    const value = {
        user,
        loading,
        login,
        register,
        logout,
        updateUser,
        isAuthenticated: !!user,
        isAdmin: user?.role === 'admin'
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};
