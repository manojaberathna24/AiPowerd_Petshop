import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaTag, FaArrowRight } from 'react-icons/fa';
import axios from 'axios';

const OffersSection = () => {
    const [offers, setOffers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchOffers();
    }, []);

    const fetchOffers = async () => {
        try {
            const { data } = await axios.get('http://localhost:5000/api/offers');
            setOffers(data.slice(0, 5)); // Show only 5 offers
        } catch (error) {
            console.error('Failed to load offers');
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (date) => {
        return new Date(date).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric'
        });
    };

    if (loading) return null;
    if (offers.length === 0) return null;

    return (
        <section className="py-16">
            <div className="max-w-7xl mx-auto px-4">
                {/* Header */}
                <div className="text-center mb-12">
                    <h2 className="text-4xl font-bold font-display mb-4">
                        Special <span className="gradient-text">Offers</span>
                    </h2>
                    <p className="text-gray-400">Limited time deals on your pet's favorites!</p>
                </div>

                {/* Offers Grid */}
                <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
                    {offers.map((offer) => (
                        <Link
                            key={offer._id}
                            to={`/products?category=${offer.category}`}
                            className="glass-card overflow-hidden hover:scale-105 transition-transform"
                        >
                            <div className="relative h-32">
                                <img
                                    src={offer.bannerImage}
                                    alt={offer.title}
                                    className="w-full h-full object-cover"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                                <div className="absolute bottom-2 left-2 right-2">
                                    <div className="flex items-center justify-between">
                                        <span className="text-white font-bold text-sm">{offer.discountPercentage}% OFF</span>
                                        <span className="text-white/80 text-xs">{formatDate(offer.validUntil)}</span>
                                    </div>
                                </div>
                                <div className="absolute top-2 left-2">
                                    <FaTag className="text-yellow-400" />
                                </div>
                            </div>
                            <div className="p-3">
                                <h3 className="font-semibold text-sm mb-1 line-clamp-2">{offer.title}</h3>
                                <p className="text-xs text-gray-400 capitalize">{offer.category} • {offer.petType}</p>
                            </div>
                        </Link>
                    ))}
                </div>

                {/* View All Button */}
                <div className="text-center">
                    <Link
                        to="/offers"
                        className="inline-flex items-center px-6 py-3 btn-gradient rounded-xl font-semibold"
                    >
                        View All Offers <FaArrowRight className="ml-2" />
                    </Link>
                </div>
            </div>
        </section>
    );
};

export default OffersSection;
