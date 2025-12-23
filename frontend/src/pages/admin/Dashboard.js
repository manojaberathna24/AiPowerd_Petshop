import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaUsers, FaShoppingBag, FaPaw, FaClipboardList, FaMapMarkerAlt, FaHeart, FaDollarSign, FaTag } from 'react-icons/fa';
import { adminAPI } from '../../services/api';
import { toast } from 'react-toastify';

const Dashboard = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            const { data } = await adminAPI.getStats();
            setStats(data);
        } catch (error) {
            toast.error('Failed to load statistics');
        } finally {
            setLoading(false);
        }
    };

    const statCards = [
        { title: 'Total Users', value: stats?.totalUsers || 0, icon: <FaUsers />, color: 'from-blue-500 to-cyan-500', link: '/admin/users' },
        { title: 'Products', value: stats?.totalProducts || 0, icon: <FaShoppingBag />, color: 'from-purple-500 to-pink-500', link: '/admin/products' },
        { title: 'Pets', value: stats?.totalPets || 0, icon: <FaPaw />, color: 'from-green-500 to-emerald-500', link: '/admin/pets' },
        { title: 'Orders', value: stats?.totalOrders || 0, icon: <FaClipboardList />, color: 'from-orange-500 to-amber-500', link: '/admin/orders' },
        { title: 'Services', value: stats?.totalServices || 0, icon: <FaMapMarkerAlt />, color: 'from-red-500 to-rose-500', link: '/admin/services' },
        { title: 'Revenue', value: `Rs. ${stats?.totalRevenue || 0}`, icon: <FaDollarSign />, color: 'from-primary-500 to-secondary-500', link: '/admin/orders' },
    ];

    const menuItems = [
        { title: 'Manage Products', icon: <FaShoppingBag />, link: '/admin/products', count: stats?.totalProducts },
        { title: 'Manage Pets', icon: <FaPaw />, link: '/admin/pets', count: stats?.totalPets },
        { title: 'Manage Orders', icon: <FaClipboardList />, link: '/admin/orders', count: stats?.pendingOrders, label: 'Pending' },
        { title: 'Manage Users', icon: <FaUsers />, link: '/admin/users', count: stats?.totalUsers },
        { title: 'Manage Services', icon: <FaMapMarkerAlt />, link: '/admin/services', count: stats?.totalServices },
        { title: 'Manage Offers', icon: <FaTag />, link: '/admin/offers', label: 'Promotions' },
        { title: 'Adoptions', icon: <FaHeart />, link: '/admin/adoptions', count: stats?.pendingAdoptions, label: 'Pending' },
    ];

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="spinner"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen py-8">
            <div className="max-w-7xl mx-auto px-4">
                <h1 className="text-3xl font-bold font-display mb-8">
                    Admin <span className="gradient-text">Dashboard</span>
                </h1>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
                    {statCards.map((card, index) => (
                        <Link key={index} to={card.link} className="glass-card p-4 hover:scale-105 transition-transform">
                            <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${card.color} flex items-center justify-center text-white text-xl mb-3`}>
                                {card.icon}
                            </div>
                            <p className="text-2xl font-bold">{card.value}</p>
                            <p className="text-gray-400 text-sm">{card.title}</p>
                        </Link>
                    ))}
                </div>

                {/* Quick Actions */}
                <h2 className="text-xl font-bold mb-4">Quick Actions</h2>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
                    {menuItems.map((item, index) => (
                        <Link key={index} to={item.link} className="glass-card p-6 flex items-center justify-between hover:bg-white/10 transition-colors">
                            <div className="flex items-center">
                                <div className="w-12 h-12 rounded-xl bg-primary-500/20 flex items-center justify-center text-primary-400 mr-4">
                                    {item.icon}
                                </div>
                                <div>
                                    <p className="font-semibold">{item.title}</p>
                                    {item.count !== undefined && (
                                        <p className="text-sm text-gray-400">
                                            {item.count} {item.label || 'Total'}
                                        </p>
                                    )}
                                </div>
                            </div>
                            <span className="text-gray-400">→</span>
                        </Link>
                    ))}
                </div>

                {/* Recent Activity */}
                <div className="grid lg:grid-cols-2 gap-6">
                    {/* Recent Orders */}
                    <div className="glass-card p-6">
                        <h3 className="font-bold mb-4">Recent Orders</h3>
                        {stats?.recentOrders?.length > 0 ? (
                            <div className="space-y-3">
                                {stats.recentOrders.map((order) => (
                                    <div key={order._id} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                                        <div>
                                            <p className="font-medium">{order.user?.name}</p>
                                            <p className="text-sm text-gray-400">Rs. {order.totalPrice}</p>
                                        </div>
                                        <span className="badge badge-warning capitalize">{order.status}</span>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-gray-400">No recent orders</p>
                        )}
                    </div>

                    {/* Recent Adoptions */}
                    <div className="glass-card p-6">
                        <h3 className="font-bold mb-4">Recent Adoption Requests</h3>
                        {stats?.recentAdoptions?.length > 0 ? (
                            <div className="space-y-3">
                                {stats.recentAdoptions.map((adoption) => (
                                    <div key={adoption._id} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                                        <div>
                                            <p className="font-medium">{adoption.user?.name}</p>
                                            <p className="text-sm text-gray-400">Wants to adopt {adoption.pet?.name}</p>
                                        </div>
                                        <span className="badge badge-warning capitalize">{adoption.status}</span>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-gray-400">No recent requests</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
