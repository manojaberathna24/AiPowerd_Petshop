import React from 'react';
import { Link } from 'react-router-dom';
import { FaTimesCircle } from 'react-icons/fa';

const PaymentCancel = () => {
    return (
        <div className="min-h-screen flex items-center justify-center py-12">
            <div className="glass-card p-12 text-center max-w-md">
                <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-red-500/20 flex items-center justify-center">
                    <FaTimesCircle className="text-5xl text-red-400" />
                </div>
                <h1 className="text-3xl font-bold mb-4">Payment Cancelled</h1>
                <p className="text-gray-400 mb-8">
                    Your payment was cancelled. Don't worry, your order has been saved. You can try again anytime.
                </p>
                <div className="space-y-3">
                    <Link to="/my-orders" className="block w-full btn-gradient py-3">
                        View My Orders
                    </Link>
                    <Link to="/cart" className="block w-full border border-white/20 py-3 rounded-xl hover:bg-white/10">
                        Back to Cart
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default PaymentCancel;
