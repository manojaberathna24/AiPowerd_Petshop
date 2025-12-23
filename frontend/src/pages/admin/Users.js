import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaUsers, FaUserPlus, FaEdit, FaTrash, FaSearch, FaUserShield, FaUser } from 'react-icons/fa';
import { toast } from 'react-toastify';

const AdminUsers = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingUser, setEditingUser] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [roleFilter, setRoleFilter] = useState('all');
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        role: 'user'
    });

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const token = localStorage.getItem('token');
            const { data } = await axios.get('http://localhost:5000/api/users', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setUsers(data);
            setLoading(false);
        } catch (error) {
            toast.error('Failed to load users');
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');

            if (editingUser) {
                await axios.put(
                    `http://localhost:5000/api/users/${editingUser._id}`,
                    formData,
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                toast.success('User updated successfully!');
            } else {
                await axios.post(
                    'http://localhost:5000/api/users',
                    formData,
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                toast.success('User created successfully!');
            }

            setShowForm(false);
            setEditingUser(null);
            resetForm();
            fetchUsers();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to save user');
        }
    };

    const handleEdit = (user) => {
        setEditingUser(user);
        setFormData({
            name: user.name,
            email: user.email,
            password: '',
            role: user.role
        });
        setShowForm(true);
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this user?')) return;

        try {
            const token = localStorage.getItem('token');
            await axios.delete(`http://localhost:5000/api/users/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            toast.success('User deleted successfully!');
            fetchUsers();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to delete user');
        }
    };

    const handleRoleChange = async (userId, newRole) => {
        if (!window.confirm(`Change user role to ${newRole}?`)) return;

        try {
            const token = localStorage.getItem('token');
            await axios.put(
                `http://localhost:5000/api/users/${userId}/role`,
                { role: newRole },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            toast.success('User role updated!');
            fetchUsers();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to update role');
        }
    };

    const resetForm = () => {
        setFormData({
            name: '',
            email: '',
            password: '',
            role: 'user'
        });
    };

    const filteredUsers = users.filter(user => {
        const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesRole = roleFilter === 'all' || user.role === roleFilter;
        return matchesSearch && matchesRole;
    });

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="spinner"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen p-6">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h1 className="text-3xl font-bold flex items-center gap-3">
                            <FaUsers className="text-primary-400" />
                            User Management
                        </h1>
                        <p className="text-gray-400 mt-1">Manage all users and roles</p>
                    </div>
                    <button
                        onClick={() => {
                            setEditingUser(null);
                            resetForm();
                            setShowForm(true);
                        }}
                        className="btn-gradient flex items-center gap-2"
                    >
                        <FaUserPlus /> Add New User
                    </button>
                </div>

                {/* Search & Filter */}
                <div className="glass-card p-4 mb-6">
                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="flex-1 relative">
                            <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search by name or email..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="input-glass pl-12 w-full"
                            />
                        </div>
                        <select
                            value={roleFilter}
                            onChange={(e) => setRoleFilter(e.target.value)}
                            className="input-glass"
                        >
                            <option value="all">All Roles</option>
                            <option value="user">Users Only</option>
                            <option value="admin">Admins Only</option>
                        </select>
                    </div>
                </div>

                {/* Users Table */}
                <div className="glass-card overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-white/5">
                                <tr>
                                    <th className="px-6 py-3 text-left text-sm font-semibold">Name</th>
                                    <th className="px-6 py-3 text-left text-sm font-semibold">Email</th>
                                    <th className="px-6 py-3 text-left text-sm font-semibold">Role</th>
                                    <th className="px-6 py-3 text-left text-sm font-semibold">Joined</th>
                                    <th className="px-6 py-3 text-right text-sm font-semibold">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/10">
                                {filteredUsers.map((user) => (
                                    <tr key={user._id} className="hover:bg-white/5 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="font-semibold">{user.name}</div>
                                        </td>
                                        <td className="px-6 py-4 text-gray-400">{user.email}</td>
                                        <td className="px-6 py-4">
                                            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${user.role === 'admin'
                                                    ? 'bg-purple-500/20 text-purple-400'
                                                    : 'bg-blue-500/20 text-blue-400'
                                                }`}>
                                                {user.role === 'admin' ? (
                                                    <><FaUserShield className="inline mr-1" /> Admin</>
                                                ) : (
                                                    <><FaUser className="inline mr-1" /> User</>
                                                )}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-gray-400">
                                            {new Date(user.createdAt).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center justify-end gap-2">
                                                <button
                                                    onClick={() => handleRoleChange(
                                                        user._id,
                                                        user.role === 'admin' ? 'user' : 'admin'
                                                    )}
                                                    className="px-3 py-1 rounded-lg bg-purple-500/20 text-purple-400 hover:bg-purple-500/30 text-sm"
                                                >
                                                    {user.role === 'admin' ? 'Demote' : 'Make Admin'}
                                                </button>
                                                <button
                                                    onClick={() => handleEdit(user)}
                                                    className="p-2 rounded-lg bg-blue-500/20 text-blue-400 hover:bg-blue-500/30"
                                                >
                                                    <FaEdit />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(user._id)}
                                                    className="p-2 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30"
                                                >
                                                    <FaTrash />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* User Form Modal */}
                {showForm && (
                    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                        <div className="glass-card p-8 max-w-md w-full">
                            <h2 className="text-2xl font-bold mb-6">
                                {editingUser ? 'Edit User' : 'Add New User'}
                            </h2>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-semibold mb-2">Name</label>
                                    <input
                                        type="text"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        className="input-glass w-full"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold mb-2">Email</label>
                                    <input
                                        type="email"
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        className="input-glass w-full"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold mb-2">
                                        Password {editingUser && '(leave blank to keep current)'}
                                    </label>
                                    <input
                                        type="password"
                                        value={formData.password}
                                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                        className="input-glass w-full"
                                        required={!editingUser}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold mb-2">Role</label>
                                    <select
                                        value={formData.role}
                                        onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                                        className="input-glass w-full"
                                    >
                                        <option value="user">User</option>
                                        <option value="admin">Admin</option>
                                    </select>
                                </div>
                                <div className="flex gap-3 pt-4">
                                    <button type="submit" className="btn-gradient flex-1">
                                        {editingUser ? 'Update User' : 'Create User'}
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setShowForm(false);
                                            setEditingUser(null);
                                            resetForm();
                                        }}
                                        className="flex-1 border border-white/20 px-6 py-3 rounded-xl hover:bg-white/10"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminUsers;
