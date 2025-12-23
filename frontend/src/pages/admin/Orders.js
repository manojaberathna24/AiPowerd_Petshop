import React, { useState, useEffect } from 'react';
import { ordersAPI } from '../../services/api';
import { toast } from 'react-toastify';

const Orders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => { fetchOrders(); }, []);

    const fetchOrders = async () => {
        try { const { data } = await ordersAPI.getAll(); setOrders(data); } catch { toast.error('Failed to load'); } finally { setLoading(false); }
    };

    const updateStatus = async (id, status) => {
        try { await ordersAPI.updateStatus(id, status); toast.success('Status updated!'); fetchOrders(); } catch { toast.error('Failed'); }
    };

    const statusColors = { pending: 'badge-warning', processing: 'badge-primary', shipped: 'badge-primary', delivered: 'badge-success', cancelled: 'badge-danger' };

    if (loading) return <div className="min-h-screen flex items-center justify-center"><div className="spinner"></div></div>;

    return (
        <div className="min-h-screen py-8">
            <div className="max-w-7xl mx-auto px-4">
                <h1 className="text-3xl font-bold font-display mb-8">Manage <span className="gradient-text">Orders</span></h1>
                <div className="glass-card overflow-hidden overflow-x-auto">
                    <table className="w-full min-w-[800px]">
                        <thead className="bg-white/5">
                            <tr>
                                <th className="px-4 py-3 text-left">Order ID</th>
                                <th className="px-4 py-3 text-left">Customer</th>
                                <th className="px-4 py-3 text-left">Items</th>
                                <th className="px-4 py-3 text-left">Total</th>
                                <th className="px-4 py-3 text-left">Status</th>
                                <th className="px-4 py-3 text-left">Date</th>
                                <th className="px-4 py-3 text-left">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {orders.map((order) => (
                                <tr key={order._id} className="border-t border-white/10">
                                    <td className="px-4 py-3 font-mono text-sm">#{order._id.slice(-8).toUpperCase()}</td>
                                    <td className="px-4 py-3">{order.user?.name}<br /><span className="text-xs text-gray-400">{order.user?.email}</span></td>
                                    <td className="px-4 py-3">{order.items.length} items</td>
                                    <td className="px-4 py-3 font-bold text-primary-400">Rs. {order.totalPrice}</td>
                                    <td className="px-4 py-3"><span className={`badge ${statusColors[order.status]}`}>{order.status}</span></td>
                                    <td className="px-4 py-3 text-sm text-gray-400">{new Date(order.createdAt).toLocaleDateString()}</td>
                                    <td className="px-4 py-3">
                                        <select value={order.status} onChange={(e) => updateStatus(order._id, e.target.value)} className="input-glass text-sm py-1">
                                            <option value="pending">Pending</option>
                                            <option value="processing">Processing</option>
                                            <option value="shipped">Shipped</option>
                                            <option value="delivered">Delivered</option>
                                            <option value="cancelled">Cancelled</option>
                                        </select>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Orders;
