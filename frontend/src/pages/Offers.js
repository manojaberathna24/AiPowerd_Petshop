import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaTag, FaShoppingCart, FaClock } from 'react-icons/fa';
import axios from 'axios';
import { toast } from 'react-toastify';

const Offers = () => {
    const [offers, setOffers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all');

    useEffect(() => {
        fetchOffers();
    }, [filter]);

    const fetchOffers = async () => {
        try {
            const params = filter !== 'all' ? { category: filter } : {};
            const { data } = await axios.get('http://localhost:5000/api/offers', { params });
            setOffers(data);
        } catch (error) {
            toast.error('Failed to load offers');
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (date) => {
        return new Date(date).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    };

    const getCategoryLink = (category, petType) => {
        if (category === 'all') return '/products';
        return `/products?category=${category}`;
    };

    return (
        <div className="min-h-screen py-8">
            <div className="max-w-7xl mx-auto px-4">
                {/* Header */}
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold font-display mb-4">
                        Special <span className="gradient-text">Offers</span>
                    </h1>
                    <p className="text-gray-400">Don't miss our amazing Christmas & New Year deals!</p>
                </div>

                {/* Filters */}
                <div className="flex flex-wrap gap-3 justify-center mb-8">
                    {['all', 'food', 'toys', 'accessories', 'grooming'].map((cat) => (
                        <button
                            key={cat}
                            onClick={() => setFilter(cat)}
                            className={`px-6 py-2 rounded-xl capitalize transition-all ${filter === cat
                                    ? 'bg-gradient-to-r from-primary-500 to-secondary-500 text-white'
                                    : 'glass-card text-gray-400 hover:text-white'
                                }`}
                        >
                            {cat === 'all' ? 'All Offers' : cat}
                        </button>
                    ))}
                </div>

                {/* Offers Grid */}
                {loading ? (
                    <div className="flex justify-center py-12">
                        <div className="spinner"></div>
                    </div>
                ) : offers.length === 0 ? (
                    <div className="text-center py-12">
                        <p className="text-gray-400 text-lg">No active offers available</p>
                    </div>
                ) : (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {offers.map((offer) => (
                            <div key={offer._id} className="glass-card overflow-hidden hover:scale-105 transition-transform">
                                {/* Offer Image */}
                                <div className="relative h-48">
                                    <img
                                        src={offer.bannerImage}
                                        alt={offer.title}
                                        className="w-full h-full object-cover"
                                    />
                                    <div className="absolute top-4 right-4 bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-4 py-2 rounded-full font-bold text-xl shadow-lg">
                                        {offer.discountPercentage}% OFF
                                    </div>
                                </div>

                                {/* Offer Content */}
                                <div className="p-6">
                                    <h3 className="text-xl font-bold mb-2">{offer.title}</h3>
                                    <p className="text-gray-400 text-sm mb-4">{offer.description}</p>

                                    {/* Details */}
                                    <div className="space-y-2 mb-4">
                                        <div className="flex items-center text-sm text-gray-400">
                                            <FaTag className="mr-2 text-primary-400" />
                                            <span className="capitalize">{offer.category} • {offer.petType}</span>
                                        </div>
                                        <div className="flex items-center text-sm text-gray-400">
                                            <FaClock className="mr-2 text-primary-400" />
                                            <span>Until {formatDate(offer.validUntil)}</span>
                                        </div>
                                    </div>

                                    {/* Shop Now Button */}
                                    <Link
                                        to={getCategoryLink(offer.category, offer.petType)}
                                        className="block w-full btn-gradient text-center py-3 rounded-xl font-semibold flex items-center justify-center"
                                    >
                                        <FaShoppingCart className="mr-2" /> Shop Now
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Offers;
