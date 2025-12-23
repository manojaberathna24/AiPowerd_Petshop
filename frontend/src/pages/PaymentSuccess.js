import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaCheckCircle } from 'react-icons/fa';
import { useCart } from '../context/CartContext';

const PaymentSuccess = () => {
    const { clearCart } = useCart();

    useEffect(() => {
        clearCart();
    }, [clearCart]);

    return (
        <div className="min-h-screen flex items-center justify-center py-12">
            <div className="glass-card p-12 text-center max-w-md">
                <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-green-500/20 flex items-center justify-center">
                    <FaCheckCircle className="text-5xl text-green-400" />
                </div>
                <h1 className="text-3xl font-bold mb-4">Payment Successful!</h1>
                <p className="text-gray-400 mb-8">
                    Thank you for your purchase. Your order has been confirmed and will be processed shortly.
                </p>
                <div className="space-y-3">
                    <Link to="/my-orders" className="block w-full btn-gradient py-3">
                        View My Orders
                    </Link>
                    <Link to="/products" className="block w-full border border-white/20 py-3 rounded-xl hover:bg-white/10">
                        Continue Shopping
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default PaymentSuccess;
