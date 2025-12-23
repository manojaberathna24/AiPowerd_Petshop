import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { FiMenu, FiX, FiShoppingCart, FiUser, FiLogOut, FiSettings } from 'react-icons/fi';
import { FaPaw } from 'react-icons/fa';

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [showUserMenu, setShowUserMenu] = useState(false);
    const { user, logout, isAdmin } = useAuth();
    const { getCartCount } = useCart();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    const navLinks = [
        { name: 'Home', path: '/' },
        { name: 'Products', path: '/products' },
        { name: 'Adopt', path: '/pets' },
        { name: 'Offers', path: '/offers' },
        { name: 'Services', path: '/services' },
        { name: 'Lost & Found', path: '/lost-found' },
        { name: 'Forum', path: '/forum' },
    ];

    return (
        <nav className="navbar sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <Link to="/" className="flex items-center space-x-2 group">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center transform group-hover:scale-110 transition-transform">
                            <FaPaw className="text-white text-xl" />
                        </div>
                        <span className="text-xl font-bold gradient-text font-display">MPS PetCare</span>
                    </Link>

                    {/* Desktop Nav */}
                    <div className="hidden md:flex items-center space-x-1">
                        {navLinks.map((link) => (
                            <Link
                                key={link.path}
                                to={link.path}
                                className="px-4 py-2 rounded-lg text-gray-300 hover:text-white hover:bg-white/10 transition-all duration-200"
                            >
                                {link.name}
                            </Link>
                        ))}
                    </div>

                    {/* Right Side */}
                    <div className="hidden md:flex items-center space-x-4">
                        {/* Cart */}
                        <Link to="/cart" className="relative p-2 hover:bg-white/10 rounded-lg transition-colors">
                            <FiShoppingCart className="text-xl text-gray-300 hover:text-white" />
                            {getCartCount() > 0 && (
                                <span className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full text-xs flex items-center justify-center text-white font-bold">
                                    {getCartCount()}
                                </span>
                            )}
                        </Link>

                        {user ? (
                            <div className="relative">
                                <button
                                    onClick={() => setShowUserMenu(!showUserMenu)}
                                    className="flex items-center space-x-2 p-2 hover:bg-white/10 rounded-lg transition-colors"
                                >
                                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center">
                                        <span className="text-white font-bold text-sm">
                                            {user.name?.charAt(0).toUpperCase()}
                                        </span>
                                    </div>
                                    <span className="text-gray-300">{user.name}</span>
                                </button>

                                {showUserMenu && (
                                    <div className="absolute right-0 mt-2 w-48 glass-card py-2 z-50">
                                        <Link
                                            to="/profile"
                                            className="flex items-center px-4 py-2 text-gray-300 hover:bg-white/10"
                                            onClick={() => setShowUserMenu(false)}
                                        >
                                            <FiUser className="mr-2" /> Profile
                                        </Link>
                                        <Link
                                            to="/my-orders"
                                            className="flex items-center px-4 py-2 text-gray-300 hover:bg-white/10"
                                            onClick={() => setShowUserMenu(false)}
                                        >
                                            <FiShoppingCart className="mr-2" /> My Orders
                                        </Link>
                                        <Link
                                            to="/my-pets"
                                            className="flex items-center px-4 py-2 text-gray-300 hover:bg-white/10"
                                            onClick={() => setShowUserMenu(false)}
                                        >
                                            <FaPaw className="mr-2" /> My Pets
                                        </Link>
                                        {isAdmin && (
                                            <Link
                                                to="/admin"
                                                className="flex items-center px-4 py-2 text-gray-300 hover:bg-white/10"
                                                onClick={() => setShowUserMenu(false)}
                                            >
                                                <FiSettings className="mr-2" /> Admin Panel
                                            </Link>
                                        )}
                                        <hr className="my-2 border-white/10" />
                                        <button
                                            onClick={handleLogout}
                                            className="w-full flex items-center px-4 py-2 text-red-400 hover:bg-white/10"
                                        >
                                            <FiLogOut className="mr-2" /> Logout
                                        </button>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="flex items-center space-x-2">
                                <Link
                                    to="/login"
                                    className="px-4 py-2 text-gray-300 hover:text-white transition-colors"
                                >
                                    Login
                                </Link>
                                <Link
                                    to="/register"
                                    className="btn-gradient text-sm"
                                >
                                    Sign Up
                                </Link>
                            </div>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        onClick={() => setIsOpen(!isOpen)}
                        className="md:hidden p-2 rounded-lg hover:bg-white/10"
                    >
                        {isOpen ? <FiX className="text-2xl" /> : <FiMenu className="text-2xl" />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            {isOpen && (
                <div className="md:hidden glass-card mx-4 mb-4 p-4">
                    {navLinks.map((link) => (
                        <Link
                            key={link.path}
                            to={link.path}
                            className="block py-2 text-gray-300 hover:text-white"
                            onClick={() => setIsOpen(false)}
                        >
                            {link.name}
                        </Link>
                    ))}
                    <hr className="my-2 border-white/10" />
                    {user ? (
                        <>
                            <Link to="/profile" className="block py-2 text-gray-300" onClick={() => setIsOpen(false)}>
                                Profile
                            </Link>
                            <Link to="/my-orders" className="block py-2 text-gray-300" onClick={() => setIsOpen(false)}>
                                My Orders
                            </Link>
                            {isAdmin && (
                                <Link to="/admin" className="block py-2 text-gray-300" onClick={() => setIsOpen(false)}>
                                    Admin Panel
                                </Link>
                            )}
                            <button onClick={handleLogout} className="w-full text-left py-2 text-red-400">
                                Logout
                            </button>
                        </>
                    ) : (
                        <div className="flex space-x-2 pt-2">
                            <Link to="/login" className="flex-1 text-center py-2 text-gray-300 border border-white/20 rounded-lg">
                                Login
                            </Link>
                            <Link to="/register" className="flex-1 text-center btn-gradient">
                                Sign Up
                            </Link>
                        </div>
                    )}
                </div>
            )}
        </nav>
    );
};

export default Navbar;
