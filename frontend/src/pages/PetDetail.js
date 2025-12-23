import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaHeart, FaMapMarkerAlt, FaCheck, FaTimes } from 'react-icons/fa';
import { petsAPI, adoptionsAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import Swal from 'sweetalert2';

const PetDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { isAuthenticated } = useAuth();
    const [pet, setPet] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showAdoptForm, setShowAdoptForm] = useState(false);
    const [adoptForm, setAdoptForm] = useState({
        message: '',
        experience: '',
        livingCondition: 'house',
        hasOtherPets: false,
        hasChildren: false
    });

    useEffect(() => {
        const fetchPet = async () => {
            try {
                const { data } = await petsAPI.getById(id);
                setPet(data);
            } catch (error) {
                console.error('Error:', error);
                toast.error('Failed to load pet details');
            } finally {
                setLoading(false);
            }
        };
        fetchPet();
    }, [id]);

    const handleAdopt = async (e) => {
        e.preventDefault();
        if (!isAuthenticated) {
            toast.info('Please login to submit an adoption request');
            navigate('/login');
            return;
        }

        try {
            await adoptionsAPI.create({ petId: id, ...adoptForm });
            Swal.fire({
                icon: 'success',
                title: 'Request Submitted!',
                text: 'Your adoption request has been submitted. We will review it shortly.',
                background: '#1e293b',
                color: '#fff'
            });
            setShowAdoptForm(false);
            // Refresh pet data
            const { data } = await petsAPI.getById(id);
            setPet(data);
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to submit request');
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="spinner"></div>
            </div>
        );
    }

    if (!pet) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p className="text-gray-400">Pet not found</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <Link to="/pets" className="inline-flex items-center text-gray-400 hover:text-white mb-8">
                    <FaArrowLeft className="mr-2" /> Back to Pets
                </Link>

                <div className="grid lg:grid-cols-2 gap-12">
                    {/* Image */}
                    <div className="glass-card p-6">
                        <img
                            src={pet.image || 'https://via.placeholder.com/500x400?text=Pet'}
                            alt={pet.name}
                            className="w-full h-96 object-cover rounded-xl"
                        />
                    </div>

                    {/* Details */}
                    <div>
                        <div className="flex items-center justify-between mb-4">
                            <span className={`badge ${pet.status === 'available' ? 'badge-success' :
                                    pet.status === 'pending' ? 'badge-warning' : 'badge-danger'
                                }`}>
                                {pet.status}
                            </span>
                            <span className="badge badge-primary capitalize">{pet.type}</span>
                        </div>

                        <h1 className="text-4xl font-bold font-display mb-4">{pet.name}</h1>

                        <p className="text-xl text-gray-400 mb-6">{pet.breed} • {pet.age} • {pet.gender}</p>

                        {pet.location && (
                            <div className="flex items-center text-gray-400 mb-6">
                                <FaMapMarkerAlt className="mr-2 text-primary-400" />
                                {pet.location}
                            </div>
                        )}

                        <p className="text-gray-400 mb-6">{pet.description || 'A lovely pet looking for a forever home!'}</p>

                        <div className="grid grid-cols-2 gap-4 mb-6">
                            <div className="glass-card p-4 text-center">
                                <div className={`text-2xl mb-1 ${pet.vaccinated ? 'text-green-400' : 'text-red-400'}`}>
                                    {pet.vaccinated ? <FaCheck className="mx-auto" /> : <FaTimes className="mx-auto" />}
                                </div>
                                <p className="text-sm text-gray-400">Vaccinated</p>
                            </div>
                            <div className="glass-card p-4 text-center">
                                <div className={`text-2xl mb-1 ${pet.neutered ? 'text-green-400' : 'text-red-400'}`}>
                                    {pet.neutered ? <FaCheck className="mx-auto" /> : <FaTimes className="mx-auto" />}
                                </div>
                                <p className="text-sm text-gray-400">Neutered</p>
                            </div>
                        </div>

                        {pet.healthInfo && (
                            <div className="mb-6">
                                <h3 className="font-semibold text-white mb-2">Health Information</h3>
                                <p className="text-gray-400">{pet.healthInfo}</p>
                            </div>
                        )}

                        {pet.personality && (
                            <div className="mb-6">
                                <h3 className="font-semibold text-white mb-2">Personality</h3>
                                <p className="text-gray-400">{pet.personality}</p>
                            </div>
                        )}

                        {pet.status === 'available' && (
                            <button
                                onClick={() => setShowAdoptForm(true)}
                                className="w-full btn-gradient flex items-center justify-center py-4 text-lg"
                            >
                                <FaHeart className="mr-2" /> Request Adoption
                            </button>
                        )}
                    </div>
                </div>

                {/* Adoption Form Modal */}
                {showAdoptForm && (
                    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                        <div className="glass-card p-8 max-w-lg w-full max-h-[90vh] overflow-y-auto">
                            <h2 className="text-2xl font-bold font-display mb-6">Adoption Request for {pet.name}</h2>
                            <form onSubmit={handleAdopt} className="space-y-4">
                                <div>
                                    <label className="block text-sm text-gray-400 mb-2">Why do you want to adopt {pet.name}?</label>
                                    <textarea
                                        value={adoptForm.message}
                                        onChange={(e) => setAdoptForm({ ...adoptForm, message: e.target.value })}
                                        className="input-glass h-24"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm text-gray-400 mb-2">Pet ownership experience</label>
                                    <textarea
                                        value={adoptForm.experience}
                                        onChange={(e) => setAdoptForm({ ...adoptForm, experience: e.target.value })}
                                        className="input-glass h-20"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm text-gray-400 mb-2">Living condition</label>
                                    <select
                                        value={adoptForm.livingCondition}
                                        onChange={(e) => setAdoptForm({ ...adoptForm, livingCondition: e.target.value })}
                                        className="input-glass"
                                    >
                                        <option value="house">House</option>
                                        <option value="apartment">Apartment</option>
                                        <option value="farm">Farm</option>
                                        <option value="other">Other</option>
                                    </select>
                                </div>
                                <div className="flex items-center space-x-6">
                                    <label className="flex items-center">
                                        <input
                                            type="checkbox"
                                            checked={adoptForm.hasOtherPets}
                                            onChange={(e) => setAdoptForm({ ...adoptForm, hasOtherPets: e.target.checked })}
                                            className="mr-2"
                                        />
                                        <span className="text-gray-400">I have other pets</span>
                                    </label>
                                    <label className="flex items-center">
                                        <input
                                            type="checkbox"
                                            checked={adoptForm.hasChildren}
                                            onChange={(e) => setAdoptForm({ ...adoptForm, hasChildren: e.target.checked })}
                                            className="mr-2"
                                        />
                                        <span className="text-gray-400">I have children</span>
                                    </label>
                                </div>
                                <div className="flex space-x-4 pt-4">
                                    <button type="submit" className="flex-1 btn-gradient">
                                        Submit Request
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setShowAdoptForm(false)}
                                        className="flex-1 px-6 py-3 border border-white/20 rounded-xl hover:bg-white/10"
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

export default PetDetail;
