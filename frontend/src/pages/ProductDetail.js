import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FaStar, FaShoppingCart, FaMinus, FaPlus, FaArrowLeft } from 'react-icons/fa';
import { productsAPI, reviewsAPI } from '../services/api';
import { useCart } from '../context/CartContext';
import { toast } from 'react-toastify';

const ProductDetail = () => {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [reviews, setReviews] = useState([]);
    const [quantity, setQuantity] = useState(1);
    const [loading, setLoading] = useState(true);
    const { addToCart } = useCart();

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const { data } = await productsAPI.getById(id);
                setProduct(data);
                const reviewsRes = await reviewsAPI.getByTarget('product', id);
                setReviews(reviewsRes.data);
            } catch (error) {
                console.error('Error:', error);
                toast.error('Failed to load product');
            } finally {
                setLoading(false);
            }
        };
        fetchProduct();
    }, [id]);

    const handleAddToCart = () => {
        if (product && product.stock >= quantity) {
            addToCart(product, quantity);
        } else {
            toast.warning('Not enough stock available');
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="spinner"></div>
            </div>
        );
    }

    if (!product) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p className="text-gray-400">Product not found</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Back Button */}
                <Link to="/products" className="inline-flex items-center text-gray-400 hover:text-white mb-8">
                    <FaArrowLeft className="mr-2" /> Back to Products
                </Link>

                <div className="grid lg:grid-cols-2 gap-12">
                    {/* Image */}
                    <div className="glass-card p-6">
                        <img
                            src={product.image || 'https://via.placeholder.com/500x400?text=Product'}
                            alt={product.name}
                            className="w-full h-96 object-cover rounded-xl"
                        />
                    </div>

                    {/* Details */}
                    <div>
                        <span className="badge badge-primary mb-4">{product.category}</span>
                        <h1 className="text-3xl md:text-4xl font-bold font-display mb-4">{product.name}</h1>

                        <div className="flex items-center mb-6">
                            <div className="flex items-center text-amber-400">
                                {[...Array(5)].map((_, i) => (
                                    <FaStar key={i} className={i < Math.round(product.rating) ? 'text-amber-400' : 'text-gray-600'} />
                                ))}
                            </div>
                            <span className="text-gray-400 ml-2">({product.numReviews} reviews)</span>
                        </div>

                        <p className="text-gray-400 text-lg mb-6">{product.description}</p>

                        <div className="flex items-center mb-6">
                            <span className="text-4xl font-bold text-primary-400">Rs. {product.price}</span>
                            <span className={`ml-4 badge ${product.stock > 0 ? 'badge-success' : 'badge-danger'}`}>
                                {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
                            </span>
                        </div>

                        {product.brand && (
                            <p className="text-gray-400 mb-4">
                                <strong className="text-white">Brand:</strong> {product.brand}
                            </p>
                        )}

                        {/* Quantity */}
                        <div className="flex items-center mb-6">
                            <span className="text-gray-400 mr-4">Quantity:</span>
                            <div className="flex items-center glass-card">
                                <button
                                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                    className="p-3 hover:bg-white/10 transition-colors"
                                >
                                    <FaMinus className="text-gray-400" />
                                </button>
                                <span className="px-6 text-xl font-semibold">{quantity}</span>
                                <button
                                    onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                                    className="p-3 hover:bg-white/10 transition-colors"
                                >
                                    <FaPlus className="text-gray-400" />
                                </button>
                            </div>
                        </div>

                        {/* Add to Cart */}
                        <button
                            onClick={handleAddToCart}
                            disabled={product.stock === 0}
                            className="w-full btn-gradient flex items-center justify-center py-4 text-lg disabled:opacity-50"
                        >
                            <FaShoppingCart className="mr-2" />
                            Add to Cart - Rs. {product.price * quantity}
                        </button>
                    </div>
                </div>

                {/* Reviews */}
                <div className="mt-16">
                    <h2 className="text-2xl font-bold font-display mb-6">Customer Reviews</h2>
                    {reviews.length > 0 ? (
                        <div className="space-y-4">
                            {reviews.map((review) => (
                                <div key={review._id} className="glass-card p-6">
                                    <div className="flex items-center justify-between mb-3">
                                        <div className="flex items-center">
                                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center mr-3">
                                                <span className="text-white font-bold">
                                                    {review.user?.name?.charAt(0) || 'U'}
                                                </span>
                                            </div>
                                            <div>
                                                <p className="font-semibold text-white">{review.user?.name || 'Anonymous'}</p>
                                                <div className="flex text-amber-400">
                                                    {[...Array(5)].map((_, i) => (
                                                        <FaStar key={i} className={i < review.rating ? 'text-amber-400' : 'text-gray-600'} size={12} />
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                        <span className="text-gray-500 text-sm">
                                            {new Date(review.createdAt).toLocaleDateString()}
                                        </span>
                                    </div>
                                    <p className="text-gray-400">{review.comment}</p>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="glass-card p-8 text-center">
                            <p className="text-gray-400">No reviews yet. Be the first to review!</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProductDetail;
