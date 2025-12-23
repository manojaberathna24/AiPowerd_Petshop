import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaPaw, FaShoppingBag, FaMapMarkerAlt, FaRobot, FaHeart, FaStar, FaArrowRight } from 'react-icons/fa';
import { productsAPI, petsAPI } from '../services/api';
import OffersSection from '../components/OffersSection';

const Home = () => {
    const [featuredProducts, setFeaturedProducts] = useState([]);
    const [featuredPets, setFeaturedPets] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [productsRes, petsRes] = await Promise.all([
                    productsAPI.getAll({ limit: 4 }),
                    petsAPI.getAvailable()
                ]);
                setFeaturedProducts(productsRes.data.slice(0, 4));
                setFeaturedPets(petsRes.data.slice(0, 4));
            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const features = [
        {
            icon: <FaRobot className="text-4xl" />,
            title: 'AI Pet Assistant',
            description: 'Get instant pet care advice from our intelligent chatbot',
            color: 'from-primary-500 to-cyan-500'
        },
        {
            icon: <FaShoppingBag className="text-4xl" />,
            title: 'Premium Products',
            description: 'Shop quality pet food, toys, and accessories',
            color: 'from-secondary-500 to-pink-500'
        },
        {
            icon: <FaHeart className="text-4xl" />,
            title: 'Pet Adoption',
            description: 'Find your perfect furry companion today',
            color: 'from-accent-500 to-emerald-500'
        },
        {
            icon: <FaMapMarkerAlt className="text-4xl" />,
            title: 'Local Services',
            description: 'Discover vets, groomers, and pet shops nearby',
            color: 'from-orange-500 to-amber-500'
        }
    ];

    const stats = [
        { value: '10K+', label: 'Happy Pets' },
        { value: '500+', label: 'Products' },
        { value: '200+', label: 'Adoptions' },
        { value: '50+', label: 'Services' }
    ];

    return (
        <div>
            {/* Hero Section */}
            <section className="hero-bg min-h-[80vh] flex items-center relative overflow-hidden">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 relative z-10">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        <div>
                            <div className="inline-flex items-center px-4 py-2 rounded-full bg-primary-500/20 border border-primary-500/30 mb-6">
                                <FaPaw className="text-primary-400 mr-2" />
                                <span className="text-primary-300 text-sm">AI-Powered Pet Care Platform</span>
                            </div>
                            <h1 className="text-4xl md:text-6xl font-bold font-display mb-6 leading-tight">
                                Your Pet Deserves{' '}
                                <span className="gradient-text">The Best Care</span>
                            </h1>
                            <p className="text-xl text-gray-400 mb-8 leading-relaxed">
                                Discover a world of premium pet products, find your perfect companion,
                                and get AI-powered advice - all in one place.
                            </p>
                            <div className="flex flex-wrap gap-4">
                                <Link to="/products" className="btn-gradient flex items-center">
                                    Shop Now <FaArrowRight className="ml-2" />
                                </Link>
                                <Link to="/pets" className="px-6 py-3 rounded-xl border border-white/20 text-white hover:bg-white/10 transition-all flex items-center">
                                    <FaHeart className="mr-2 text-pink-400" /> Adopt a Pet
                                </Link>
                            </div>
                        </div>
                        <div className="relative hidden lg:block">
                            <div className="w-96 h-96 mx-auto relative">
                                <div className="absolute inset-0 bg-gradient-to-br from-primary-500/20 to-secondary-500/20 rounded-full blur-3xl"></div>
                                <div className="relative glass-card p-8 rounded-3xl">
                                    <img
                                        src="https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=400"
                                        alt="Happy Pet"
                                        className="w-full h-80 object-cover rounded-2xl"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-16">
                        {stats.map((stat, index) => (
                            <div key={index} className="glass-card p-6 text-center">
                                <div className="text-3xl font-bold gradient-text mb-1">{stat.value}</div>
                                <div className="text-gray-400 text-sm">{stat.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold font-display mb-4">
                            Everything Your Pet <span className="gradient-text">Needs</span>
                        </h2>
                        <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                            From nutrition to training, we've got all your pet care needs covered
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {features.map((feature, index) => (
                            <div key={index} className="glass-card p-6 text-center group hover:scale-105 transition-transform duration-300">
                                <div className={`w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center text-white transform group-hover:scale-110 transition-transform`}>
                                    {feature.icon}
                                </div>
                                <h3 className="text-xl font-semibold mb-2 text-white">{feature.title}</h3>
                                <p className="text-gray-400">{feature.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Special Offers Section */}
            <OffersSection />

            {/* Featured Products */}
            <section className="py-20 bg-slate-900/30">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center mb-12">
                        <div>
                            <h2 className="text-3xl font-bold font-display mb-2">
                                Featured <span className="gradient-text">Products</span>
                            </h2>
                            <p className="text-gray-400">Premium products for your beloved pets</p>
                        </div>
                        <Link to="/products" className="hidden md:flex items-center text-primary-400 hover:text-primary-300">
                            View All <FaArrowRight className="ml-2" />
                        </Link>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {loading ? (
                            [...Array(4)].map((_, i) => (
                                <div key={i} className="glass-card p-4 animate-pulse">
                                    <div className="w-full h-48 bg-white/10 rounded-xl mb-4"></div>
                                    <div className="h-4 bg-white/10 rounded mb-2"></div>
                                    <div className="h-4 bg-white/10 rounded w-2/3"></div>
                                </div>
                            ))
                        ) : featuredProducts.length > 0 ? (
                            featuredProducts.map((product) => (
                                <Link key={product._id} to={`/products/${product._id}`} className="product-card p-4 group">
                                    <div className="relative overflow-hidden rounded-xl mb-4">
                                        <img
                                            src={product.image || 'https://via.placeholder.com/300x200?text=Product'}
                                            alt={product.name}
                                            className="w-full h-48 object-cover transform group-hover:scale-110 transition-transform duration-500"
                                        />
                                        <div className="absolute top-3 right-3">
                                            <span className="badge badge-primary">{product.category}</span>
                                        </div>
                                    </div>
                                    <h3 className="font-semibold text-white mb-1 truncate">{product.name}</h3>
                                    <div className="flex items-center justify-between">
                                        <span className="text-xl font-bold text-primary-400">Rs. {product.price}</span>
                                        <div className="flex items-center text-amber-400">
                                            <FaStar className="mr-1" />
                                            <span className="text-sm">{product.rating || '4.5'}</span>
                                        </div>
                                    </div>
                                </Link>
                            ))
                        ) : (
                            <div className="col-span-4 text-center py-12 text-gray-400">
                                No products available yet. Check back soon!
                            </div>
                        )}
                    </div>
                </div>
            </section>

            {/* Featured Pets */}
            <section className="py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center mb-12">
                        <div>
                            <h2 className="text-3xl font-bold font-display mb-2">
                                Pets Looking for <span className="gradient-text">Home</span>
                            </h2>
                            <p className="text-gray-400">Give them the love they deserve</p>
                        </div>
                        <Link to="/pets" className="hidden md:flex items-center text-primary-400 hover:text-primary-300">
                            View All <FaArrowRight className="ml-2" />
                        </Link>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {loading ? (
                            [...Array(4)].map((_, i) => (
                                <div key={i} className="glass-card p-4 animate-pulse">
                                    <div className="w-full h-48 bg-white/10 rounded-xl mb-4"></div>
                                    <div className="h-4 bg-white/10 rounded mb-2"></div>
                                    <div className="h-4 bg-white/10 rounded w-2/3"></div>
                                </div>
                            ))
                        ) : featuredPets.length > 0 ? (
                            featuredPets.map((pet) => (
                                <Link key={pet._id} to={`/pets/${pet._id}`} className="pet-card glass-card p-4 group">
                                    <div className="relative overflow-hidden rounded-xl mb-4">
                                        <img
                                            src={pet.image || 'https://via.placeholder.com/300x200?text=Pet'}
                                            alt={pet.name}
                                            className="w-full h-48 object-cover transform group-hover:scale-110 transition-transform duration-500"
                                        />
                                        <div className="absolute top-3 right-3">
                                            <span className={`badge ${pet.status === 'available' ? 'badge-success' : 'badge-warning'}`}>
                                                {pet.status}
                                            </span>
                                        </div>
                                    </div>
                                    <h3 className="font-semibold text-white mb-1">{pet.name}</h3>
                                    <p className="text-gray-400 text-sm">{pet.breed} • {pet.age}</p>
                                </Link>
                            ))
                        ) : (
                            <div className="col-span-4 text-center py-12 text-gray-400">
                                No pets available for adoption yet. Check back soon!
                            </div>
                        )}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="glass-card p-12 text-center relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-br from-primary-500/10 to-secondary-500/10"></div>
                        <div className="relative z-10">
                            <FaPaw className="text-6xl text-primary-400 mx-auto mb-6" />
                            <h2 className="text-3xl md:text-4xl font-bold font-display mb-4">
                                Ready to Give a Pet a <span className="gradient-text">Forever Home?</span>
                            </h2>
                            <p className="text-gray-400 text-lg mb-8 max-w-2xl mx-auto">
                                Join thousands of happy pet parents who found their perfect companions through MPS PetCare.
                            </p>
                            <Link to="/pets" className="btn-gradient inline-flex items-center text-lg">
                                Start Adoption Process <FaArrowRight className="ml-2" />
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Home;
