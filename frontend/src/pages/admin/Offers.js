import React, { useState, useEffect } from 'react';
import { FaPlus, FaEdit, FaTrash, FaTag, FaImage, FaTimes } from 'react-icons/fa';
import axios from 'axios';
import { toast } from 'react-toastify';

const AdminOffers = () => {
    const [offers, setOffers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingOffer, setEditingOffer] = useState(null);
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState('');
    const [uploading, setUploading] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        category: 'all',
        petType: 'all',
        discountPercentage: 0,
        validFrom: '',
        validUntil: '',
        bannerImage: '',
        isActive: true
    });

    useEffect(() => {
        fetchOffers();
    }, []);

    const fetchOffers = async () => {
        try {
            // Fetch all offers (including inactive) for admin
            const { data } = await axios.get('http://localhost:5000/api/offers/all');
            console.log('Fetched offers:', data);
            setOffers(data);
            setLoading(false);
        } catch (error) {
            console.error('Fetch error:', error.response || error);
            toast.error(`Failed to load offers: ${error.response?.data?.message || error.message}`);
            setLoading(false);
        }
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 5 * 1024 * 1024) {
                toast.error('Image size should be less than 5MB');
                return;
            }
            setImageFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const uploadImage = async () => {
        if (!imageFile) return formData.bannerImage;

        setUploading(true);
        try {
            const token = localStorage.getItem('token');
            const uploadFormData = new FormData();
            uploadFormData.append('image', imageFile);

            const { data } = await axios.post(
                'http://localhost:5000/api/upload',
                uploadFormData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            return `http://localhost:5000${data.path}`;
        } catch (error) {
            console.error('Upload error:', error);
            toast.error('Failed to upload image');
            return null;
        } finally {
            setUploading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const token = localStorage.getItem('token');

            // Upload image if selected
            let imageUrl = formData.bannerImage;
            if (imageFile) {
                imageUrl = await uploadImage();
                if (!imageUrl) return;
            }

            const offerData = {
                ...formData,
                bannerImage: imageUrl
            };

            if (editingOffer) {
                await axios.put(
                    `http://localhost:5000/api/offers/${editingOffer._id}`,
                    offerData,
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                toast.success('Offer updated successfully!');
            } else {
                await axios.post(
                    'http://localhost:5000/api/offers',
                    offerData,
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                toast.success('Offer created successfully!');
            }

            setShowForm(false);
            setEditingOffer(null);
            resetForm();
            fetchOffers(); // Refresh the list
        } catch (error) {
            console.error('Submit error:', error);
            toast.error('Failed to save offer');
        }
    };

    const handleEdit = (offer) => {
        setEditingOffer(offer);
        setFormData({
            title: offer.title,
            description: offer.description,
            category: offer.category,
            petType: offer.petType,
            discountPercentage: offer.discountPercentage,
            validFrom: offer.validFrom.split('T')[0],
            validUntil: offer.validUntil.split('T')[0],
            bannerImage: offer.bannerImage,
            isActive: offer.isActive
        });
        setImagePreview(offer.bannerImage);
        setShowForm(true);
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this offer?')) return;

        try {
            const token = localStorage.getItem('token');

            if (!token) {
                toast.error('Please login again - no auth token found');
                return;
            }

            console.log('Deleting offer with ID:', id);
            console.log('Using token:', token.substring(0, 20) + '...');

            const response = await axios.delete(`http://localhost:5000/api/offers/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            console.log('Delete response:', response.data);
            toast.success('Offer deleted successfully!');
            fetchOffers(); // Refresh the list
        } catch (error) {
            console.error('Delete error:', error.response || error);
            if (error.response?.status === 401) {
                toast.error('Authentication failed - please login again');
            } else if (error.response?.status === 404) {
                toast.error('Offer not found');
            } else {
                toast.error(`Failed to delete offer: ${error.response?.data?.message || error.message}`);
            }
        }
    };

    const resetForm = () => {
        setFormData({
            title: '',
            description: '',
            category: 'all',
            petType: 'all',
            discountPercentage: 0,
            validFrom: '',
            validUntil: '',
            bannerImage: '',
            isActive: true
        });
        setImageFile(null);
        setImagePreview('');
    };

    const formatDate = (date) => {
        return new Date(date).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    };

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-bold">Manage Offers</h1>
                    <p className="text-gray-400 text-sm mt-1">Create and manage promotional offers</p>
                </div>
                <button
                    onClick={() => {
                        resetForm();
                        setEditingOffer(null);
                        setShowForm(true);
                    }}
                    className="btn-gradient flex items-center"
                >
                    <FaPlus className="mr-2" /> Create Offer
                </button>
            </div>

            {/* Offers Grid */}
            {loading ? (
                <div className="flex justify-center py-12">
                    <div className="spinner"></div>
                </div>
            ) : offers.length === 0 ? (
                <div className="glass-card p-12 text-center">
                    <FaTag className="text-6xl text-gray-600 mx-auto mb-4" />
                    <h3 className="text-xl font-bold mb-2">No Offers Yet</h3>
                    <p className="text-gray-400 mb-6">Create your first promotional offer to get started!</p>
                    <button
                        onClick={() => {
                            resetForm();
                            setEditingOffer(null);
                            setShowForm(true);
                        }}
                        className="btn-gradient inline-flex items-center"
                    >
                        <FaPlus className="mr-2" /> Create First Offer
                    </button>
                </div>
            ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {offers.map((offer) => (
                        <div key={offer._id} className="glass-card overflow-hidden hover:scale-105 transition-transform">
                            <div className="relative h-40">
                                <img
                                    src={offer.bannerImage}
                                    alt={offer.title}
                                    className="w-full h-full object-cover"
                                />
                                <div className="absolute top-3 right-3 bg-yellow-500 text-white px-3 py-1 rounded-full font-bold text-sm shadow-lg">
                                    {offer.discountPercentage}% OFF
                                </div>
                                <div className={`absolute top-3 left-3 px-2 py-1 rounded text-xs font-semibold ${offer.isActive ? 'bg-green-500' : 'bg-red-500'
                                    } text-white`}>
                                    {offer.isActive ? 'Active' : 'Inactive'}
                                </div>
                            </div>
                            <div className="p-4">
                                <h3 className="font-bold text-lg mb-2">{offer.title}</h3>
                                <p className="text-sm text-gray-400 mb-3 line-clamp-2">{offer.description}</p>
                                <div className="text-xs text-gray-500 mb-3">
                                    <p className="capitalize">Category: {offer.category} • Pet: {offer.petType}</p>
                                    <p>Valid: {formatDate(offer.validFrom)} - {formatDate(offer.validUntil)}</p>
                                </div>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => handleEdit(offer)}
                                        className="flex-1 flex items-center justify-center px-3 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-sm transition-colors"
                                    >
                                        <FaEdit className="mr-1" /> Edit
                                    </button>
                                    <button
                                        onClick={() => handleDelete(offer._id)}
                                        className="flex-1 flex items-center justify-center px-3 py-2 bg-red-600 hover:bg-red-700 rounded-lg text-sm transition-colors"
                                    >
                                        <FaTrash className="mr-1" /> Delete
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Create/Edit Form Modal */}
            {showForm && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="glass-card p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-bold">
                                {editingOffer ? 'Edit Offer' : 'Create New Offer'}
                            </h2>
                            <button
                                onClick={() => {
                                    setShowForm(false);
                                    setEditingOffer(null);
                                    resetForm();
                                }}
                                className="text-gray-400 hover:text-white"
                            >
                                <FaTimes size={24} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            {/* Image Upload */}
                            <div>
                                <label className="block text-sm text-gray-400 mb-2">
                                    <FaImage className="inline mr-2" />
                                    Offer Banner Image
                                </label>
                                <div className="flex flex-col gap-3">
                                    <label className="btn-gradient cursor-pointer inline-flex items-center justify-center">
                                        <FaImage className="mr-2" />
                                        {imageFile ? 'Change Image' : 'Upload Image'}
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={handleImageChange}
                                            className="hidden"
                                        />
                                    </label>
                                    {imagePreview && (
                                        <div className="relative w-full h-48 rounded-xl overflow-hidden">
                                            <img
                                                src={imagePreview}
                                                alt="Preview"
                                                className="w-full h-full object-cover"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setImageFile(null);
                                                    setImagePreview('');
                                                    setFormData({ ...formData, bannerImage: '' });
                                                }}
                                                className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600"
                                            >
                                                <FaTimes />
                                            </button>
                                        </div>
                                    )}
                                    <p className="text-xs text-gray-500">Max size: 5MB</p>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm text-gray-400 mb-2">Title</label>
                                <input
                                    type="text"
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    className="input-glass"
                                    required
                                    placeholder="e.g., Christmas Special - Pet Food Sale"
                                />
                            </div>

                            <div>
                                <label className="block text-sm text-gray-400 mb-2">Description</label>
                                <textarea
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    className="input-glass h-20"
                                    required
                                    placeholder="Brief description of the offer"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm text-gray-400 mb-2">Category</label>
                                    <select
                                        value={formData.category}
                                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                        className="input-glass"
                                    >
                                        <option value="all">All Categories</option>
                                        <option value="food">Food</option>
                                        <option value="toys">Toys</option>
                                        <option value="accessories">Accessories</option>
                                        <option value="grooming">Grooming</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm text-gray-400 mb-2">Pet Type</label>
                                    <select
                                        value={formData.petType}
                                        onChange={(e) => setFormData({ ...formData, petType: e.target.value })}
                                        className="input-glass"
                                    >
                                        <option value="all">All Pets</option>
                                        <option value="dog">Dog</option>
                                        <option value="cat">Cat</option>
                                        <option value="bird">Bird</option>
                                        <option value="fish">Fish</option>
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm text-gray-400 mb-2">
                                    Discount Percentage (0-100%)
                                </label>
                                <input
                                    type="number"
                                    min="0"
                                    max="100"
                                    value={formData.discountPercentage}
                                    onChange={(e) => setFormData({ ...formData, discountPercentage: e.target.value })}
                                    className="input-glass"
                                    required
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm text-gray-400 mb-2">Valid From</label>
                                    <input
                                        type="date"
                                        value={formData.validFrom}
                                        onChange={(e) => setFormData({ ...formData, validFrom: e.target.value })}
                                        className="input-glass"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm text-gray-400 mb-2">Valid Until</label>
                                    <input
                                        type="date"
                                        value={formData.validUntil}
                                        onChange={(e) => setFormData({ ...formData, validUntil: e.target.value })}
                                        className="input-glass"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    id="isActive"
                                    checked={formData.isActive}
                                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                                    className="w-4 h-4"
                                />
                                <label htmlFor="isActive" className="text-sm text-gray-400">
                                    Make this offer active immediately
                                </label>
                            </div>

                            <div className="flex gap-4 pt-4">
                                <button
                                    type="submit"
                                    className="flex-1 btn-gradient"
                                    disabled={uploading}
                                >
                                    {uploading ? 'Uploading...' : editingOffer ? 'Update Offer' : 'Create Offer'}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setShowForm(false);
                                        setEditingOffer(null);
                                        resetForm();
                                    }}
                                    className="flex-1 border border-white/20 px-6 py-3 rounded-xl hover:bg-white/10 transition-colors"
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminOffers;
