import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaShoppingBag, FaEye, FaTimes, FaClock, FaCheck, FaTruck } from 'react-icons/fa';
import { ordersAPI } from '../services/api';
import { toast } from 'react-toastify';

const MyOrders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [showDetails, setShowDetails] = useState(false);

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            const { data } = await ordersAPI.getMyOrders();
            setOrders(data);
        } catch (error) {
            toast.error('Failed to load orders');
        } finally {
            setLoading(false);
        }
    };

    const statusColors = {
        pending: 'badge-warning',
        processing: 'badge-primary',
        shipped: 'badge-primary',
        delivered: 'badge-success',
        cancelled: 'badge-danger'
    };

    const formatDateTime = (date) => {
        return new Date(date).toLocaleString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        });
    };

    const viewOrderDetails = (order) => {
        setSelectedOrder(order);
        setShowDetails(true);
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="spinner"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen py-8">
            <div className="max-w-4xl mx-auto px-4">
                <h1 className="text-3xl font-bold font-display mb-8">
                    My <span className="gradient-text">Orders</span>
                </h1>

                {orders.length === 0 ? (
                    <div className="glass-card p-12 text-center">
                        <FaShoppingBag className="text-5xl text-gray-600 mx-auto mb-4" />
                        <h2 className="text-xl font-bold mb-2">No Orders Yet</h2>
                        <p className="text-gray-400 mb-6">Start shopping to see your orders here</p>
                        <Link to="/products" className="btn-gradient inline-block">Browse Products</Link>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {orders.map((order) => (
                            <div key={order._id} className="glass-card p-6">
                                <div className="flex items-start justify-between mb-4">
                                    <div>
                                        <p className="text-sm text-gray-400">Order #{order._id.slice(-8).toUpperCase()}</p>
                                        <div className="space-y-1 mt-2">
                                            <p className="text-sm text-gray-400 flex items-center gap-2">
                                                <FaClock className="text-primary-400" />
                                                <span>Ordered: {formatDateTime(order.createdAt)}</span>
                                            </p>
                                            {order.updatedAt && order.updatedAt !== order.createdAt && (
                                                <p className="text-sm text-gray-400 flex items-center gap-2">
                                                    <FaClock className="text-secondary-400" />
                                                    <span>Updated: {formatDateTime(order.updatedAt)}</span>
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                    <span className={`badge ${statusColors[order.status]}`}>
                                        {order.status}
                                    </span>
                                </div>

                                <div className="flex flex-wrap gap-4 mb-4">
                                    {order.items.slice(0, 3).map((item, idx) => (
                                        <img
                                            key={idx}
                                            src={item.image || 'https://via.placeholder.com/60'}
                                            alt={item.name}
                                            className="w-16 h-16 object-cover rounded-lg"
                                        />
                                    ))}
                                    {order.items.length > 3 && (
                                        <div className="w-16 h-16 rounded-lg bg-white/10 flex items-center justify-center text-gray-400">
                                            +{order.items.length - 3}
                                        </div>
                                    )}
                                </div>

                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-gray-400 text-sm">{order.items.length} items</p>
                                        <p className="text-xl font-bold text-primary-400">Rs. {order.totalPrice}</p>
                                    </div>
                                    <button
                                        onClick={() => viewOrderDetails(order)}
                                        className="flex items-center text-primary-400 hover:text-primary-300 transition-colors"
                                    >
                                        <FaEye className="mr-2" /> View Details
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Order Details Modal */}
                {showDetails && selectedOrder && (
                    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                        <div className="glass-card p-8 max-w-3xl w-full max-h-[90vh] overflow-y-auto">
                            <div className="flex justify-between items-start mb-6">
                                <div>
                                    <h2 className="text-2xl font-bold mb-2">Order Details</h2>
                                    <p className="text-gray-400">Order #{selectedOrder._id}</p>
                                </div>
                                <button
                                    onClick={() => setShowDetails(false)}
                                    className="text-gray-400 hover:text-white transition-colors"
                                >
                                    <FaTimes size={24} />
                                </button>
                            </div>

                            {/* Order Timeline */}
                            <div className="mb-6 p-4 bg-white/5 rounded-xl">
                                <h3 className="font-semibold mb-4 flex items-center gap-2">
                                    <FaClock className="text-primary-400" />
                                    Order Timeline
                                </h3>
                                <div className="space-y-3">
                                    {selectedOrder.statusHistory && selectedOrder.statusHistory.length > 0 ? (
                                        selectedOrder.statusHistory.map((history, index) => {
                                            const getStatusIcon = (status) => {
                                                switch (status) {
                                                    case 'pending':
                                                        return <FaClock className="text-yellow-400" />;
                                                    case 'processing':
                                                        return <FaClock className="text-blue-400" />;
                                                    case 'shipped':
                                                        return <FaTruck className="text-purple-400" />;
                                                    case 'delivered':
                                                        return <FaCheck className="text-green-400" />;
                                                    case 'cancelled':
                                                        return <FaTimes className="text-red-400" />;
                                                    default:
                                                        return <FaClock className="text-gray-400" />;
                                                }
                                            };

                                            const getStatusLabel = (status) => {
                                                switch (status) {
                                                    case 'pending':
                                                        return 'Order Placed';
                                                    case 'processing':
                                                        return 'Preparing Order';
                                                    case 'shipped':
                                                        return 'Order Shipped';
                                                    case 'delivered':
                                                        return 'Order Delivered';
                                                    case 'cancelled':
                                                        return 'Order Cancelled';
                                                    default:
                                                        return status;
                                                }
                                            };

                                            return (
                                                <div key={index} className="flex items-start gap-3 p-3 bg-white/5 rounded-lg">
                                                    <div className="mt-1">
                                                        {getStatusIcon(history.status)}
                                                    </div>
                                                    <div className="flex-1">
                                                        <p className="font-semibold capitalize">
                                                            {getStatusLabel(history.status)}
                                                        </p>
                                                        <p className="text-sm text-gray-400">
                                                            {formatDateTime(history.timestamp)}
                                                        </p>
                                                        {history.note && (
                                                            <p className="text-xs text-gray-500 mt-1">{history.note}</p>
                                                        )}
                                                    </div>
                                                </div>
                                            );
                                        })
                                    ) : (
                                        <div className="text-sm text-gray-400">
                                            <div className="flex items-center gap-2 mb-2">
                                                <FaClock className="text-primary-400" />
                                                <span className="text-gray-400">Created:</span>
                                                <span>{formatDateTime(selectedOrder.createdAt)}</span>
                                            </div>
                                            {selectedOrder.updatedAt && (
                                                <div className="flex items-center gap-2">
                                                    <FaClock className="text-secondary-400" />
                                                    <span className="text-gray-400">Last Updated:</span>
                                                    <span>{formatDateTime(selectedOrder.updatedAt)}</span>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Order Items */}
                            <div className="mb-6">
                                <h3 className="font-semibold mb-4">Order Items</h3>
                                <div className="space-y-3">
                                    {selectedOrder.items?.map((item, index) => (
                                        <div key={index} className="flex items-center gap-4 p-3 bg-white/5 rounded-lg">
                                            <img
                                                src={item.image || 'https://via.placeholder.com/60'}
                                                alt={item.name}
                                                className="w-16 h-16 object-cover rounded-lg"
                                            />
                                            <div className="flex-1">
                                                <p className="font-semibold">{item.name}</p>
                                                <p className="text-sm text-gray-400">Quantity: {item.quantity}</p>
                                            </div>
                                            <p className="font-semibold">Rs. {item.price * item.quantity}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Order Summary */}
                            <div className="border-t border-white/10 pt-4">
                                <div className="space-y-2 mb-4">
                                    <div className="flex justify-between text-gray-400">
                                        <span>Subtotal:</span>
                                        <span>Rs. {selectedOrder.totalPrice}</span>
                                    </div>
                                    <div className="flex justify-between font-bold text-lg">
                                        <span>Total:</span>
                                        <span className="gradient-text">Rs. {selectedOrder.totalPrice}</span>
                                    </div>
                                    <div className="flex justify-between text-sm text-gray-400">
                                        <span>Status:</span>
                                        <span className={`badge ${statusColors[selectedOrder.status]}`}>
                                            {selectedOrder.status}
                                        </span>
                                    </div>
                                </div>

                                <button
                                    onClick={() => setShowDetails(false)}
                                    className="w-full border border-white/20 px-6 py-3 rounded-xl hover:bg-white/10 transition-colors"
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default MyOrders;
