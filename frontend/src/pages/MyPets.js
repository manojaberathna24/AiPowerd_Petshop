import React, { useState, useEffect } from 'react';
import { FaPaw, FaHeart } from 'react-icons/fa';
import { authAPI } from '../services/api';
import { toast } from 'react-toastify';

const MyPets = () => {
    const [pets, setPets] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchMyPets();
    }, []);

    const fetchMyPets = async () => {
        try {
            const { data } = await authAPI.getProfile();
            setPets(data.myPets || []);
        } catch (error) {
            toast.error('Failed to load your pets');
        } finally {
            setLoading(false);
        }
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
                    My <span className="gradient-text">Pets</span>
                </h1>

                {pets.length === 0 ? (
                    <div className="glass-card p-12 text-center">
                        <FaPaw className="text-5xl text-gray-600 mx-auto mb-4" />
                        <h2 className="text-xl font-bold mb-2">No Pets Yet</h2>
                        <p className="text-gray-400">
                            Your adopted pets will appear here once approved
                        </p>
                    </div>
                ) : (
                    <div className="grid md:grid-cols-2 gap-6">
                        {pets.map((pet) => (
                            <div key={pet._id} className="glass-card overflow-hidden">
                                <img
                                    src={pet.image || 'https://via.placeholder.com/300x200?text=Pet'}
                                    alt={pet.name}
                                    className="w-full h-48 object-cover"
                                />
                                <div className="p-6">
                                    <div className="flex items-center justify-between mb-2">
                                        <h3 className="text-xl font-bold">{pet.name}</h3>
                                        <FaHeart className="text-pink-500" />
                                    </div>
                                    <p className="text-gray-400 mb-2">{pet.breed} • {pet.age}</p>
                                    <span className="badge badge-success">Adopted</span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default MyPets;
