import React, { useState, useEffect } from 'react';
import { FaPlus, FaHeart, FaComment, FaEye } from 'react-icons/fa';
import { forumAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';

const Forum = () => {
    const { isAuthenticated } = useAuth();
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [category, setCategory] = useState('');
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({ title: '', content: '', category: 'general' });

    const categories = ['general', 'health', 'nutrition', 'training', 'adoption', 'other'];

    useEffect(() => {
        fetchPosts();
    }, [category]);

    const fetchPosts = async () => {
        try {
            const params = category ? { category } : {};
            const { data } = await forumAPI.getAll(params);
            setPosts(data);
        } catch (error) {
            toast.error('Failed to load posts');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!isAuthenticated) {
            toast.info('Please login to create a post');
            return;
        }
        try {
            await forumAPI.create(formData);
            toast.success('Post created!');
            setShowForm(false);
            setFormData({ title: '', content: '', category: 'general' });
            fetchPosts();
        } catch (error) {
            toast.error('Failed to create post');
        }
    };

    const handleLike = async (postId) => {
        if (!isAuthenticated) {
            toast.info('Please login to like posts');
            return;
        }
        try {
            await forumAPI.like(postId);
            fetchPosts();
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className="min-h-screen py-8">
            <div className="max-w-4xl mx-auto px-4">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-3xl font-bold font-display">
                            Pet <span className="gradient-text">Community</span>
                        </h1>
                        <p className="text-gray-400">Share tips and connect with pet lovers</p>
                    </div>
                    <button onClick={() => setShowForm(true)} className="btn-gradient flex items-center">
                        <FaPlus className="mr-2" /> New Post
                    </button>
                </div>

                {/* Categories */}
                <div className="flex flex-wrap gap-2 mb-8">
                    <button
                        onClick={() => setCategory('')}
                        className={`px-4 py-2 rounded-full transition-all ${category === '' ? 'bg-primary-500 text-white' : 'glass-card text-gray-400'
                            }`}
                    >
                        All
                    </button>
                    {categories.map((cat) => (
                        <button
                            key={cat}
                            onClick={() => setCategory(cat)}
                            className={`px-4 py-2 rounded-full capitalize transition-all ${category === cat ? 'bg-primary-500 text-white' : 'glass-card text-gray-400'
                                }`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>

                {/* Posts */}
                {loading ? (
                    <div className="flex justify-center py-12"><div className="spinner"></div></div>
                ) : (
                    <div className="space-y-4">
                        {posts.map((post) => (
                            <div key={post._id} className="glass-card p-6">
                                <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                        <div className="flex items-center mb-2">
                                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center mr-3">
                                                <span className="text-white font-bold">
                                                    {post.user?.name?.charAt(0) || 'U'}
                                                </span>
                                            </div>
                                            <div>
                                                <p className="font-semibold">{post.user?.name}</p>
                                                <p className="text-xs text-gray-500">
                                                    {new Date(post.createdAt).toLocaleDateString()}
                                                </p>
                                            </div>
                                        </div>
                                        <span className="badge badge-primary text-xs mb-2 capitalize">{post.category}</span>
                                        <h3 className="text-xl font-bold mb-2">{post.title}</h3>
                                        <p className="text-gray-400 line-clamp-3">{post.content}</p>
                                    </div>
                                </div>
                                <div className="flex items-center space-x-6 mt-4 pt-4 border-t border-white/10">
                                    <button
                                        onClick={() => handleLike(post._id)}
                                        className="flex items-center text-gray-400 hover:text-pink-500"
                                    >
                                        <FaHeart className="mr-2" /> {post.likes?.length || 0}
                                    </button>
                                    <span className="flex items-center text-gray-400">
                                        <FaComment className="mr-2" /> {post.replies?.length || 0}
                                    </span>
                                    <span className="flex items-center text-gray-400">
                                        <FaEye className="mr-2" /> {post.views || 0}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Create Post Modal */}
                {showForm && (
                    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                        <div className="glass-card p-8 max-w-lg w-full">
                            <h2 className="text-2xl font-bold mb-6">Create Post</h2>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <input
                                    type="text"
                                    placeholder="Title"
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    className="input-glass"
                                    required
                                />
                                <select
                                    value={formData.category}
                                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                    className="input-glass"
                                >
                                    {categories.map((cat) => (
                                        <option key={cat} value={cat}>{cat.charAt(0).toUpperCase() + cat.slice(1)}</option>
                                    ))}
                                </select>
                                <textarea
                                    placeholder="What's on your mind?"
                                    value={formData.content}
                                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                                    className="input-glass h-32"
                                    required
                                />
                                <div className="flex space-x-4">
                                    <button type="submit" className="flex-1 btn-gradient">Post</button>
                                    <button type="button" onClick={() => setShowForm(false)} className="flex-1 border border-white/20 px-6 py-3 rounded-xl">Cancel</button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Forum;
