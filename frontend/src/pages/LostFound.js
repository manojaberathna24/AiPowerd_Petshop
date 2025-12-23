import React, { useState, useEffect } from 'react';
import { FaSearch, FaPlus, FaMapMarkerAlt, FaPhone, FaCalendar, FaImage } from 'react-icons/fa';
import { lostFoundAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import axios from 'axios';

const LostFound = () => {
    const { isAuthenticated } = useAuth();
    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('');
    const [showForm, setShowForm] = useState(false);
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState('');
    const [uploading, setUploading] = useState(false);
    const [formData, setFormData] = useState({
        type: 'lost',
        petType: 'dog',
        breed: '',
        color: '',
        description: '',
        address: '',
        date: '',
        contactName: '',
        contactPhone: '',
        reward: 0,
        image: ''
    });

    useEffect(() => {
        fetchReports();
    }, [filter]);

    const fetchReports = async () => {
        try {
            const params = filter ? { type: filter } : {};
            const { data } = await lostFoundAPI.getAll(params);
            setReports(data);
        } catch (error) {
            toast.error('Failed to load reports');
        } finally {
            setLoading(false);
        }
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 5 * 1024 * 1024) {
                toast.error('Image size must be less than 5MB');
                return;
            }
            setImageFile(file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const uploadImage = async () => {
        if (!imageFile) return '';

        setUploading(true);
        const formData = new FormData();
        formData.append('image', imageFile);

        try {
            const token = localStorage.getItem('token');
            const { data } = await axios.post('http://localhost:5000/api/upload', formData, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data'
                }
            });
            return data.path;
        } catch (error) {
            toast.error('Failed to upload image');
            return '';
        } finally {
            setUploading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!isAuthenticated) {
            toast.info('Please login to create a report');
            return;
        }

        try {
            let imagePath = formData.image;

            // Upload image if selected
            if (imageFile) {
                imagePath = await uploadImage();
                if (!imagePath) return;
            }

            const reportData = {
                ...formData,
                image: imagePath,
                location: {
                    address: formData.address
                }
            };

            await lostFoundAPI.create(reportData);
            toast.success('Report created successfully!');
            setShowForm(false);
            setImageFile(null);
            setImagePreview('');
            setFormData({
                type: 'lost',
                petType: 'dog',
                breed: '',
                color: '',
                description: '',
                address: '',
                date: '',
                contactName: '',
                contactPhone: '',
                reward: 0,
                image: ''
            });
            fetchReports();
        } catch (error) {
            toast.error('Failed to create report');
        }
    };

    return (
        <div className="min-h-screen py-8">
            <div className="max-w-7xl mx-auto px-4">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-3xl font-bold font-display">
                            Lost & <span className="gradient-text">Found</span>
                        </h1>
                        <p className="text-gray-400">Help reunite pets with their families</p>
                    </div>
                    <button onClick={() => setShowForm(true)} className="btn-gradient flex items-center">
                        <FaPlus className="mr-2" /> Report Pet
                    </button>
                </div>

                {/* Filters */}
                <div className="flex space-x-4 mb-8">
                    {['', 'lost', 'found'].map((type) => (
                        <button
                            key={type}
                            onClick={() => setFilter(type)}
                            className={`px-6 py-2 rounded-xl transition-all ${filter === type
                                ? 'bg-gradient-to-r from-primary-500 to-secondary-500 text-white'
                                : 'glass-card text-gray-400 hover:text-white'
                                }`}
                        >
                            {type === '' ? 'All' : type === 'lost' ? 'Lost Pets' : 'Found Pets'}
                        </button>
                    ))}
                </div>

                {/* Reports Grid */}
                {loading ? (
                    <div className="flex justify-center py-12">
                        <div className="spinner"></div>
                    </div>
                ) : reports.length === 0 ? (
                    <div className="text-center py-12">
                        <p className="text-gray-400 text-lg">No reports found. Be the first to add one!</p>
                    </div>
                ) : (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {reports.map((report) => (
                            <div key={report._id} className="glass-card overflow-hidden hover:scale-105 transition-transform">
                                <div className="relative">
                                    <img
                                        src={report.image || 'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=400'}
                                        alt="Pet"
                                        className="w-full h-48 object-cover"
                                    />
                                    <span className={`absolute top-3 left-3 px-3 py-1 rounded-full text-sm font-semibold ${report.type === 'lost' ? 'bg-red-500' : 'bg-green-500'
                                        } text-white`}>
                                        {report.type.toUpperCase()}
                                    </span>
                                    {report.reward > 0 && (
                                        <span className="absolute top-3 right-3 px-3 py-1 rounded-full text-sm font-semibold bg-yellow-500 text-white">
                                            Rs. {report.reward} Reward
                                        </span>
                                    )}
                                </div>
                                <div className="p-4">
                                    <h3 className="font-bold text-lg mb-2 capitalize">
                                        {report.petType} - {report.color}
                                    </h3>
                                    {report.breed && (
                                        <p className="text-sm text-gray-400 mb-2">Breed: {report.breed}</p>
                                    )}
                                    <p className="text-gray-400 text-sm mb-3 line-clamp-2">{report.description}</p>
                                    <div className="space-y-2 text-sm text-gray-400">
                                        <div className="flex items-center">
                                            <FaMapMarkerAlt className="mr-2 text-primary-400" />
                                            {report.location?.address}
                                        </div>
                                        <div className="flex items-center">
                                            <FaCalendar className="mr-2 text-primary-400" />
                                            {new Date(report.date).toLocaleDateString()}
                                        </div>
                                        <div className="flex items-center">
                                            <FaPhone className="mr-2 text-primary-400" />
                                            {report.contactPhone}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Create Report Modal */}
                {showForm && (
                    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                        <div className="glass-card p-8 max-w-lg w-full max-h-[90vh] overflow-y-auto">
                            <h2 className="text-2xl font-bold mb-6">Report Lost/Found Pet</h2>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                {/* Image Upload */}
                                <div>
                                    <label className="block text-sm text-gray-400 mb-2">Pet Photo</label>
                                    <div className="relative">
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={handleImageChange}
                                            className="hidden"
                                            id="pet-image"
                                        />
                                        <label
                                            htmlFor="pet-image"
                                            className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-white/20 rounded-xl cursor-pointer hover:border-primary-500 transition-colors"
                                        >
                                            {imagePreview ? (
                                                <img src={imagePreview} alt="Preview" className="w-full h-full object-cover rounded-xl" />
                                            ) : (
                                                <div className="text-center">
                                                    <FaImage className="mx-auto text-4xl text-gray-400 mb-2" />
                                                    <p className="text-gray-400">Click to upload photo</p>
                                                    <p className="text-xs text-gray-500">Max 5MB</p>
                                                </div>
                                            )}
                                        </label>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm text-gray-400 mb-2">Report Type</label>
                                        <select
                                            value={formData.type}
                                            onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                                            className="input-glass"
                                        >
                                            <option value="lost">Lost Pet</option>
                                            <option value="found">Found Pet</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm text-gray-400 mb-2">Pet Type</label>
                                        <select
                                            value={formData.petType}
                                            onChange={(e) => setFormData({ ...formData, petType: e.target.value })}
                                            className="input-glass"
                                        >
                                            <option value="dog">Dog</option>
                                            <option value="cat">Cat</option>
                                            <option value="bird">Bird</option>
                                            <option value="other">Other</option>
                                        </select>
                                    </div>
                                </div>

                                <input
                                    type="text"
                                    placeholder="Breed (optional)"
                                    value={formData.breed}
                                    onChange={(e) => setFormData({ ...formData, breed: e.target.value })}
                                    className="input-glass"
                                />

                                <input
                                    type="text"
                                    placeholder="Color"
                                    value={formData.color}
                                    onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                                    className="input-glass"
                                    required
                                />

                                <textarea
                                    placeholder="Description (markings, behavior, etc.)"
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    className="input-glass h-20"
                                    required
                                />

                                <input
                                    type="text"
                                    placeholder="Last seen location / Found location"
                                    value={formData.address}
                                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                    className="input-glass"
                                    required
                                />

                                <input
                                    type="date"
                                    value={formData.date}
                                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                                    className="input-glass"
                                    required
                                />

                                <input
                                    type="text"
                                    placeholder="Your Name"
                                    value={formData.contactName}
                                    onChange={(e) => setFormData({ ...formData, contactName: e.target.value })}
                                    className="input-glass"
                                    required
                                />

                                <input
                                    type="tel"
                                    placeholder="Phone Number"
                                    value={formData.contactPhone}
                                    onChange={(e) => setFormData({ ...formData, contactPhone: e.target.value })}
                                    className="input-glass"
                                    required
                                />

                                {formData.type === 'lost' && (
                                    <input
                                        type="number"
                                        placeholder="Reward Amount (optional)"
                                        value={formData.reward}
                                        onChange={(e) => setFormData({ ...formData, reward: e.target.value })}
                                        className="input-glass"
                                    />
                                )}

                                <div className="flex space-x-4 pt-4">
                                    <button
                                        type="submit"
                                        className="flex-1 btn-gradient"
                                        disabled={uploading}
                                    >
                                        {uploading ? 'Uploading...' : 'Submit Report'}
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setShowForm(false);
                                            setImagePreview('');
                                            setImageFile(null);
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

export default LostFound;
