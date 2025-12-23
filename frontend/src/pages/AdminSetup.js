import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaUserShield, FaCrown, FaEnvelope, FaLock, FaUser, FaPhone, FaKey } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { toast } from 'react-toastify';

const AdminSetup = () => {
    const navigate = useNavigate();
    const { login } = useAuth();
    const [loading, setLoading] = useState(false);
    const [checkingAdmin, setCheckingAdmin] = useState(true);
    const [adminExists, setAdminExists] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        phone: '',
        secretKey: ''
    });

    useEffect(() => {
        checkAdminExists();
    }, []);

    const checkAdminExists = async () => {
        try {
            const { data } = await axios.get('http://localhost:5000/api/auth/check-admin');
            setAdminExists(data.adminExists);
        } catch (error) {
            console.error('Check admin error:', error);
        } finally {
            setCheckingAdmin(false);
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (formData.password !== formData.confirmPassword) {
            toast.error('Passwords do not match!');
            return;
        }

        if (formData.password.length < 6) {
            toast.error('Password must be at least 6 characters');
            return;
        }

        setLoading(true);
        try {
            const { data } = await axios.post('http://localhost:5000/api/auth/admin-setup', {
                name: formData.name,
                email: formData.email,
                password: formData.password,
                phone: formData.phone,
                secretKey: formData.secretKey
            });

            // Login the admin
            login(data);
            toast.success('Admin account created successfully!');
            navigate('/admin');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to create admin account');
        } finally {
            setLoading(false);
        }
    };

    if (checkingAdmin) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="spinner"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center py-12 px-4">
            <div className="glass-card p-8 w-full max-w-md">
                <div className="text-center mb-8">
                    <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-yellow-500 to-orange-500 flex items-center justify-center">
                        <FaCrown className="text-4xl text-white" />
                    </div>
                    <h2 className="text-2xl font-bold font-display">
                        {adminExists ? 'Create Another Admin' : 'Admin Setup'}
                    </h2>
                    <p className="text-gray-400 mt-2">
                        {adminExists
                            ? 'Enter secret key to create additional admin'
                            : 'Create your first admin account'}
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm text-gray-400 mb-2">Full Name</label>
                        <div className="relative">
                            <FaUser className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                className="input-glass pl-12"
                                placeholder="Admin Name"
                                required
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm text-gray-400 mb-2">Email</label>
                        <div className="relative">
                            <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                className="input-glass pl-12"
                                placeholder="admin@example.com"
                                required
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm text-gray-400 mb-2">Phone</label>
                        <div className="relative">
                            <FaPhone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input
                                type="tel"
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                className="input-glass pl-12"
                                placeholder="+94 77 123 4567"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm text-gray-400 mb-2">Password</label>
                        <div className="relative">
                            <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                className="input-glass pl-12"
                                placeholder="••••••••"
                                required
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm text-gray-400 mb-2">Confirm Password</label>
                        <div className="relative">
                            <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input
                                type="password"
                                name="confirmPassword"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                className="input-glass pl-12"
                                placeholder="••••••••"
                                required
                            />
                        </div>
                    </div>

                    {adminExists && (
                        <div>
                            <label className="block text-sm text-gray-400 mb-2">Admin Secret Key</label>
                            <div className="relative">
                                <FaKey className="absolute left-4 top-1/2 -translate-y-1/2 text-yellow-400" />
                                <input
                                    type="password"
                                    name="secretKey"
                                    value={formData.secretKey}
                                    onChange={handleChange}
                                    className="input-glass pl-12 border-yellow-500/30"
                                    placeholder="Enter admin secret key"
                                    required
                                />
                            </div>
                            <p className="text-xs text-yellow-400 mt-1">
                                Contact existing admin for the secret key
                            </p>
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 py-3 rounded-xl font-semibold flex items-center justify-center transition-all disabled:opacity-50"
                    >
                        {loading ? (
                            <div className="spinner w-5 h-5"></div>
                        ) : (
                            <>
                                <FaUserShield className="mr-2" /> Create Admin Account
                            </>
                        )}
                    </button>
                </form>

                <div className="mt-6 text-center">
                    <Link to="/login" className="text-primary-400 hover:text-primary-300">
                        ← Back to Login
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default AdminSetup;
