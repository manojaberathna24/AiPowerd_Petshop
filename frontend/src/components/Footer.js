import React from 'react';
import { Link } from 'react-router-dom';
import { FaPaw, FaFacebook, FaTwitter, FaInstagram, FaYoutube } from 'react-icons/fa';
import { FiMail, FiPhone, FiMapPin } from 'react-icons/fi';

const Footer = () => {
    return (
        <footer className="bg-slate-900/50 backdrop-blur-lg border-t border-white/10 mt-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {/* Brand */}
                    <div>
                        <Link to="/" className="flex items-center space-x-2 mb-4">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center">
                                <FaPaw className="text-white text-xl" />
                            </div>
                            <span className="text-xl font-bold gradient-text font-display">MPS PetCare</span>
                        </Link>
                        <p className="text-gray-400 text-sm mb-4">
                            Your ultimate AI-powered pet care hub. Shop supplies, adopt pets, find services, and get expert advice.
                        </p>
                        <div className="flex space-x-4">
                            <a href="#" className="text-gray-400 hover:text-primary-400 transition-colors">
                                <FaFacebook size={20} />
                            </a>
                            <a href="#" className="text-gray-400 hover:text-primary-400 transition-colors">
                                <FaTwitter size={20} />
                            </a>
                            <a href="#" className="text-gray-400 hover:text-primary-400 transition-colors">
                                <FaInstagram size={20} />
                            </a>
                            <a href="#" className="text-gray-400 hover:text-primary-400 transition-colors">
                                <FaYoutube size={20} />
                            </a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="text-white font-semibold mb-4">Quick Links</h3>
                        <ul className="space-y-2">
                            <li><Link to="/products" className="text-gray-400 hover:text-white transition-colors">Products</Link></li>
                            <li><Link to="/pets" className="text-gray-400 hover:text-white transition-colors">Adopt a Pet</Link></li>
                            <li><Link to="/offers" className="text-gray-400 hover:text-white transition-colors gradient-text font-semibold">🎉 Special Offers</Link></li>
                            <li><Link to="/services" className="text-gray-400 hover:text-white transition-colors">Find Services</Link></li>
                            <li><Link to="/lost-found" className="text-gray-400 hover:text-white transition-colors">Lost & Found</Link></li>
                            <li><Link to="/forum" className="text-gray-400 hover:text-white transition-colors">Community Forum</Link></li>
                        </ul>
                    </div>

                    {/* Categories */}
                    <div>
                        <h3 className="text-white font-semibold mb-4">Categories</h3>
                        <ul className="space-y-2">
                            <li><Link to="/products?category=food" className="text-gray-400 hover:text-white transition-colors">Pet Food</Link></li>
                            <li><Link to="/products?category=toys" className="text-gray-400 hover:text-white transition-colors">Toys & Games</Link></li>
                            <li><Link to="/products?category=accessories" className="text-gray-400 hover:text-white transition-colors">Accessories</Link></li>
                            <li><Link to="/products?category=medicine" className="text-gray-400 hover:text-white transition-colors">Health Care</Link></li>
                            <li><Link to="/products?category=grooming" className="text-gray-400 hover:text-white transition-colors">Grooming</Link></li>
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h3 className="text-white font-semibold mb-4">Contact Us</h3>
                        <ul className="space-y-3">
                            <li className="flex items-center text-gray-400">
                                <FiMapPin className="mr-2 text-primary-400" />
                                <span>123 Pet Street, Colombo, Sri Lanka</span>
                            </li>
                            <li className="flex items-center text-gray-400">
                                <FiPhone className="mr-2 text-primary-400" />
                                <span>+94 11 234 5678</span>
                            </li>
                            <li className="flex items-center text-gray-400">
                                <FiMail className="mr-2 text-primary-400" />
                                <span>hello@mpspetcare.lk</span>
                            </li>
                        </ul>
                    </div>
                </div>

                <hr className="my-8 border-white/10" />

                <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                    <div className="text-center md:text-left">
                        <p className="text-gray-400 text-sm">
                            © {new Date().getFullYear()} MPS PetCare. All rights reserved.
                        </p>
                        <p className="text-gray-500 text-xs mt-1">
                            Powered by <span className="gradient-text font-semibold">MPS AI Solutions Pvt Ltd</span>
                        </p>
                    </div>
                    <div className="flex flex-col md:flex-row items-center gap-4">
                        <div className="flex space-x-6">
                            <Link to="/privacy-policy" className="text-gray-400 hover:text-white text-sm transition-colors">
                                Privacy Policy
                            </Link>
                            <Link to="/terms-of-service" className="text-gray-400 hover:text-white text-sm transition-colors">
                                Terms of Service
                            </Link>
                            <Link to="/cookie-policy" className="text-gray-400 hover:text-white text-sm transition-colors">
                                Cookie Policy
                            </Link>
                        </div>
                        {/* Social Media Links */}
                        <div className="flex space-x-4">
                            <a
                                href="https://www.facebook.com/yourpage"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-gray-400 hover:text-blue-500 transition-colors"
                                aria-label="Facebook"
                            >
                                <FaFacebook className="text-xl" />
                            </a>
                            <a
                                href="https://twitter.com/yourhandle"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-gray-400 hover:text-blue-400 transition-colors"
                                aria-label="Twitter"
                            >
                                <FaTwitter className="text-xl" />
                            </a>
                            <a
                                href="https://www.instagram.com/yourhandle"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-gray-400 hover:text-pink-500 transition-colors"
                                aria-label="Instagram"
                            >
                                <FaInstagram className="text-xl" />
                            </a>
                            <a
                                href="https://www.youtube.com/yourchannel"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-gray-400 hover:text-red-500 transition-colors"
                                aria-label="YouTube"
                            >
                                <FaYoutube className="text-xl" />
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
