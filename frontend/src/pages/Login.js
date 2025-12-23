import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaPaw, FaEnvelope, FaLock } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { toast } from 'react-toastify';
import GoogleSignInButton from '../components/GoogleSignInButton';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        const result = await login(email, password);
        setLoading(false);
        if (result.success) {
            navigate('/');
        }
    };

    const handleGoogleSuccess = async (credential) => {
        try {
            setLoading(true);
            const { data } = await axios.post(`${process.env.REACT_APP_API_URL}/api/auth/google`, {
                credential
            });

            // Store token and user data
            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data));

            toast.success('Google Sign-In successful!');
            window.location.href = '/';
        } catch (error) {
            toast.error(error.response?.data?.message || 'Google Sign-In failed');
            setLoading(false);
        }
    };

    const handleGoogleError = (error) => {
        toast.error('Google Sign-In failed. Please try again.');
        console.error('Google Sign-In Error:', error);
    };

    return (
        <div className="min-h-screen flex items-center justify-center py-12 px-4">
            <div className="max-w-md w-full">
                <div className="glass-card p-8">
                    {/* Header */}
                    <div className="text-center mb-8">
                        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center mx-auto mb-4">
                            <FaPaw className="text-white text-2xl" />
                        </div>
                        <h1 className="text-3xl font-bold font-display">Welcome Back</h1>
                        <p className="text-gray-400 mt-2">Sign in to your account</p>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-sm text-gray-400 mb-2">Email Address</label>
                            <div className="relative">
                                <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="Enter your email"
                                    className="input-glass pl-12"
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm text-gray-400 mb-2">Password</label>
                            <div className="relative">
                                <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="Enter your password"
                                    className="input-glass pl-12"
                                    required
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full btn-gradient flex items-center justify-center py-3 disabled:opacity-50"
                        >
                            {loading ? <div className="spinner w-5 h-5"></div> : 'Sign In'}
                        </button>
                    </form>

                    {/* Divider */}
                    <div className="relative my-6">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-white/10"></div>
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-4 bg-dark-800 text-gray-400">Or continue with</span>
                        </div>
                    </div>

                    {/* Google Sign-In */}
                    <GoogleSignInButton
                        onSuccess={handleGoogleSuccess}
                        onError={handleGoogleError}
                    />

                    {/* Footer */}
                    <div className="mt-6 text-center">
                        <p className="text-gray-400">
                            Don't have an account?{' '}
                            <Link to="/register" className="text-primary-400 hover:text-primary-300">
                                Sign Up
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
