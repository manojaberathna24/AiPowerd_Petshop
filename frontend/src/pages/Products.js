import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { FaStar, FaShoppingCart, FaFilter, FaSearch } from 'react-icons/fa';
import { productsAPI } from '../services/api';
import { useCart } from '../context/CartContext';
import { toast } from 'react-toastify';

const Products = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchParams, setSearchParams] = useSearchParams();
    const [search, setSearch] = useState('');
    const [filters, setFilters] = useState({
        category: searchParams.get('category') || '',
        petType: '',
        sort: 'newest'
    });
    const { addToCart } = useCart();

    const categories = ['food', 'toys', 'accessories', 'medicine', 'grooming', 'other'];
    const petTypes = ['dog', 'cat', 'bird', 'fish', 'rabbit', 'all'];

    useEffect(() => {
        fetchProducts();
    }, [filters]);

    const fetchProducts = async () => {
        setLoading(true);
        try {
            const params = {};
            if (filters.category) params.category = filters.category;
            if (filters.petType) params.petType = filters.petType;
            if (search) params.search = search;
            if (filters.sort) params.sort = filters.sort;

            const { data } = await productsAPI.getAll(params);
            setProducts(data);
        } catch (error) {
            console.error('Error fetching products:', error);
            toast.error('Failed to load products');
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (e) => {
        e.preventDefault();
        fetchProducts();
    };

    const handleAddToCart = (e, product) => {
        e.preventDefault();
        e.stopPropagation();
        if (product.stock > 0) {
            addToCart(product, 1);
        } else {
            toast.warning('Product is out of stock');
        }
    };

    return (
        <div className="min-h-screen py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl md:text-4xl font-bold font-display mb-2">
                        Pet <span className="gradient-text">Products</span>
                    </h1>
                    <p className="text-gray-400">Quality products for your beloved companions</p>
                </div>

                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Filters Sidebar */}
                    <div className="lg:w-64 flex-shrink-0">
                        <div className="glass-card p-6 sticky top-24">
                            <h3 className="text-lg font-semibold mb-4 flex items-center">
                                <FaFilter className="mr-2 text-primary-400" /> Filters
                            </h3>

                            {/* Search */}
                            <form onSubmit={handleSearch} className="mb-6">
                                <div className="relative">
                                    <input
                                        type="text"
                                        value={search}
                                        onChange={(e) => setSearch(e.target.value)}
                                        placeholder="Search products..."
                                        className="input-glass pr-10"
                                    />
                                    <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                                        <FaSearch />
                                    </button>
                                </div>
                            </form>

                            {/* Category */}
                            <div className="mb-6">
                                <h4 className="text-sm font-medium text-gray-300 mb-3">Category</h4>
                                <select
                                    value={filters.category}
                                    onChange={(e) => setFilters({ ...filters, category: e.target.value })}
                                    className="input-glass"
                                >
                                    <option value="">All Categories</option>
                                    {categories.map((cat) => (
                                        <option key={cat} value={cat}>{cat.charAt(0).toUpperCase() + cat.slice(1)}</option>
                                    ))}
                                </select>
                            </div>

                            {/* Pet Type */}
                            <div className="mb-6">
                                <h4 className="text-sm font-medium text-gray-300 mb-3">Pet Type</h4>
                                <select
                                    value={filters.petType}
                                    onChange={(e) => setFilters({ ...filters, petType: e.target.value })}
                                    className="input-glass"
                                >
                                    <option value="">All Pets</option>
                                    {petTypes.map((type) => (
                                        <option key={type} value={type}>{type.charAt(0).toUpperCase() + type.slice(1)}</option>
                                    ))}
                                </select>
                            </div>

                            {/* Sort */}
                            <div>
                                <h4 className="text-sm font-medium text-gray-300 mb-3">Sort By</h4>
                                <select
                                    value={filters.sort}
                                    onChange={(e) => setFilters({ ...filters, sort: e.target.value })}
                                    className="input-glass"
                                >
                                    <option value="newest">Newest First</option>
                                    <option value="price-low">Price: Low to High</option>
                                    <option value="price-high">Price: High to Low</option>
                                    <option value="rating">Top Rated</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Products Grid */}
                    <div className="flex-1">
                        {loading ? (
                            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {[...Array(6)].map((_, i) => (
                                    <div key={i} className="glass-card p-4 animate-pulse">
                                        <div className="w-full h-48 bg-white/10 rounded-xl mb-4"></div>
                                        <div className="h-4 bg-white/10 rounded mb-2"></div>
                                        <div className="h-4 bg-white/10 rounded w-2/3"></div>
                                    </div>
                                ))}
                            </div>
                        ) : products.length > 0 ? (
                            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {products.map((product) => (
                                    <Link key={product._id} to={`/products/${product._id}`} className="product-card p-4 group">
                                        <div className="relative overflow-hidden rounded-xl mb-4">
                                            <img
                                                src={product.image || 'https://via.placeholder.com/300x200?text=Product'}
                                                alt={product.name}
                                                className="w-full h-48 object-cover transform group-hover:scale-110 transition-transform duration-500"
                                            />
                                            <div className="absolute top-3 left-3">
                                                <span className="badge badge-primary">{product.category}</span>
                                            </div>
                                            {product.stock === 0 && (
                                                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                                                    <span className="badge badge-danger text-lg">Out of Stock</span>
                                                </div>
                                            )}
                                        </div>
                                        <h3 className="font-semibold text-white mb-1 truncate">{product.name}</h3>
                                        <p className="text-gray-400 text-sm mb-3 line-clamp-2">{product.description}</p>
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <span className="text-xl font-bold text-primary-400">Rs. {product.price}</span>
                                                <div className="flex items-center text-amber-400 text-sm mt-1">
                                                    <FaStar className="mr-1" />
                                                    <span>{product.rating || '4.5'}</span>
                                                    <span className="text-gray-500 ml-1">({product.numReviews || 0})</span>
                                                </div>
                                            </div>
                                            <button
                                                onClick={(e) => handleAddToCart(e, product)}
                                                disabled={product.stock === 0}
                                                className="w-12 h-12 rounded-full bg-gradient-to-r from-primary-500 to-secondary-500 flex items-center justify-center text-white hover:opacity-90 disabled:opacity-50 transition-opacity"
                                            >
                                                <FaShoppingCart />
                                            </button>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        ) : (
                            <div className="glass-card p-12 text-center">
                                <p className="text-gray-400 text-lg">No products found matching your criteria.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Products;
