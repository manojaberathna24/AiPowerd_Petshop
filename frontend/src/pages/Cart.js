import React from 'react';
import { Link } from 'react-router-dom';
import { FaTrash, FaMinus, FaPlus, FaShoppingBag, FaArrowRight } from 'react-icons/fa';
import { useCart } from '../context/CartContext';

const Cart = () => {
    const { cartItems, removeFromCart, updateQuantity, getCartTotal, clearCart } = useCart();

    if (cartItems.length === 0) {
        return (
            <div className="min-h-screen flex items-center justify-center py-12">
                <div className="text-center">
                    <FaShoppingBag className="text-6xl text-gray-600 mx-auto mb-6" />
                    <h2 className="text-2xl font-bold mb-4">Your Cart is Empty</h2>
                    <p className="text-gray-400 mb-6">Start shopping to add items to your cart</p>
                    <Link to="/products" className="btn-gradient inline-flex items-center">
                        Browse Products <FaArrowRight className="ml-2" />
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <h1 className="text-3xl font-bold font-display mb-8">
                    Shopping <span className="gradient-text">Cart</span>
                </h1>

                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Cart Items */}
                    <div className="lg:col-span-2 space-y-4">
                        {cartItems.map((item) => (
                            <div key={item._id} className="glass-card p-4 flex items-center gap-4">
                                <img
                                    src={item.image || 'https://via.placeholder.com/100'}
                                    alt={item.name}
                                    className="w-24 h-24 object-cover rounded-xl"
                                />
                                <div className="flex-1">
                                    <h3 className="font-semibold text-white">{item.name}</h3>
                                    <p className="text-gray-400 text-sm">{item.category}</p>
                                    <p className="text-primary-400 font-bold mt-1">Rs. {item.price}</p>
                                </div>
                                <div className="flex items-center glass-card">
                                    <button
                                        onClick={() => updateQuantity(item._id, item.quantity - 1)}
                                        className="p-2 hover:bg-white/10 transition-colors"
                                    >
                                        <FaMinus className="text-gray-400 text-xs" />
                                    </button>
                                    <span className="px-4 font-semibold">{item.quantity}</span>
                                    <button
                                        onClick={() => updateQuantity(item._id, item.quantity + 1)}
                                        disabled={item.quantity >= item.stock}
                                        className="p-2 hover:bg-white/10 transition-colors disabled:opacity-50"
                                    >
                                        <FaPlus className="text-gray-400 text-xs" />
                                    </button>
                                </div>
                                <div className="text-right">
                                    <p className="font-bold text-lg">Rs. {item.price * item.quantity}</p>
                                    <button
                                        onClick={() => removeFromCart(item._id)}
                                        className="text-red-400 hover:text-red-300 mt-1"
                                    >
                                        <FaTrash />
                                    </button>
                                </div>
                            </div>
                        ))}

                        <button
                            onClick={clearCart}
                            className="text-red-400 hover:text-red-300 text-sm"
                        >
                            Clear Cart
                        </button>
                    </div>

                    {/* Order Summary */}
                    <div className="lg:col-span-1">
                        <div className="glass-card p-6 sticky top-24">
                            <h3 className="text-xl font-bold mb-6">Order Summary</h3>

                            <div className="space-y-3 mb-6">
                                <div className="flex justify-between text-gray-400">
                                    <span>Subtotal</span>
                                    <span>Rs. {getCartTotal()}</span>
                                </div>
                                <div className="flex justify-between text-gray-400">
                                    <span>Shipping</span>
                                    <span>Rs. {getCartTotal() > 5000 ? 0 : 350}</span>
                                </div>
                                <hr className="border-white/10" />
                                <div className="flex justify-between text-xl font-bold">
                                    <span>Total</span>
                                    <span className="text-primary-400">
                                        Rs. {getCartTotal() + (getCartTotal() > 5000 ? 0 : 350)}
                                    </span>
                                </div>
                            </div>

                            <p className="text-gray-400 text-sm mb-4">
                                {getCartTotal() > 5000
                                    ? '✓ Free shipping on orders over Rs. 5,000'
                                    : `Add Rs. ${5000 - getCartTotal()} more for free shipping`
                                }
                            </p>

                            <Link
                                to="/checkout"
                                className="w-full btn-gradient flex items-center justify-center py-3"
                            >
                                Proceed to Checkout <FaArrowRight className="ml-2" />
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Cart;
