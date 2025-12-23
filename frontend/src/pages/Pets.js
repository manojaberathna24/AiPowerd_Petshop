import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaHeart, FaFilter, FaSearch, FaMapMarkerAlt } from 'react-icons/fa';
import { petsAPI } from '../services/api';
import { toast } from 'react-toastify';

const Pets = () => {
    const [pets, setPets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [filters, setFilters] = useState({
        type: '',
        gender: '',
        status: ''
    });

    const petTypes = ['dog', 'cat', 'bird', 'fish', 'rabbit', 'hamster', 'other'];

    useEffect(() => {
        fetchPets();
    }, [filters]);

    const fetchPets = async () => {
        setLoading(true);
        try {
            const params = {};
            if (filters.type) params.type = filters.type;
            if (filters.gender) params.gender = filters.gender;
            if (filters.status) params.status = filters.status;
            if (search) params.search = search;

            const { data } = await petsAPI.getAll(params);
            setPets(data);
        } catch (error) {
            console.error('Error fetching pets:', error);
            toast.error('Failed to load pets');
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (e) => {
        e.preventDefault();
        fetchPets();
    };

    return (
        <div className="min-h-screen py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="text-center mb-12">
                    <h1 className="text-3xl md:text-4xl font-bold font-display mb-4">
                        Find Your <span className="gradient-text">Perfect Companion</span>
                    </h1>
                    <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                        Every pet deserves a loving home. Browse our adorable pets waiting for adoption.
                    </p>
                </div>

                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Filters */}
                    <div className="lg:w-64 flex-shrink-0">
                        <div className="glass-card p-6 sticky top-24">
                            <h3 className="text-lg font-semibold mb-4 flex items-center">
                                <FaFilter className="mr-2 text-primary-400" /> Filters
                            </h3>

                            <form onSubmit={handleSearch} className="mb-6">
                                <div className="relative">
                                    <input
                                        type="text"
                                        value={search}
                                        onChange={(e) => setSearch(e.target.value)}
                                        placeholder="Search by name..."
                                        className="input-glass pr-10"
                                    />
                                    <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                                        <FaSearch />
                                    </button>
                                </div>
                            </form>

                            <div className="mb-6">
                                <h4 className="text-sm font-medium text-gray-300 mb-3">Pet Type</h4>
                                <select
                                    value={filters.type}
                                    onChange={(e) => setFilters({ ...filters, type: e.target.value })}
                                    className="input-glass"
                                >
                                    <option value="">All Types</option>
                                    {petTypes.map((type) => (
                                        <option key={type} value={type}>{type.charAt(0).toUpperCase() + type.slice(1)}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="mb-6">
                                <h4 className="text-sm font-medium text-gray-300 mb-3">Gender</h4>
                                <select
                                    value={filters.gender}
                                    onChange={(e) => setFilters({ ...filters, gender: e.target.value })}
                                    className="input-glass"
                                >
                                    <option value="">All</option>
                                    <option value="male">Male</option>
                                    <option value="female">Female</option>
                                </select>
                            </div>

                            <div>
                                <h4 className="text-sm font-medium text-gray-300 mb-3">Status</h4>
                                <select
                                    value={filters.status}
                                    onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                                    className="input-glass"
                                >
                                    <option value="">All Status</option>
                                    <option value="available">Available</option>
                                    <option value="pending">Pending</option>
                                    <option value="adopted">Adopted</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Pets Grid */}
                    <div className="flex-1">
                        {loading ? (
                            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {[...Array(6)].map((_, i) => (
                                    <div key={i} className="glass-card p-4 animate-pulse">
                                        <div className="w-full h-56 bg-white/10 rounded-xl mb-4"></div>
                                        <div className="h-4 bg-white/10 rounded mb-2"></div>
                                        <div className="h-4 bg-white/10 rounded w-2/3"></div>
                                    </div>
                                ))}
                            </div>
                        ) : pets.length > 0 ? (
                            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {pets.map((pet) => (
                                    <Link key={pet._id} to={`/pets/${pet._id}`} className="pet-card glass-card overflow-hidden group">
                                        <div className="relative overflow-hidden">
                                            <img
                                                src={pet.image || 'https://via.placeholder.com/300x250?text=Pet'}
                                                alt={pet.name}
                                                className="w-full h-56 object-cover transform group-hover:scale-110 transition-transform duration-500"
                                            />
                                            <div className="absolute top-3 right-3">
                                                <span className={`badge ${pet.status === 'available' ? 'badge-success' :
                                                        pet.status === 'pending' ? 'badge-warning' : 'badge-danger'
                                                    }`}>
                                                    {pet.status}
                                                </span>
                                            </div>
                                            <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                                                <h3 className="text-xl font-bold text-white">{pet.name}</h3>
                                                <p className="text-gray-300 text-sm">{pet.breed}</p>
                                            </div>
                                        </div>
                                        <div className="p-4">
                                            <div className="flex items-center justify-between mb-3">
                                                <div className="flex items-center space-x-3 text-sm text-gray-400">
                                                    <span className="capitalize">{pet.type}</span>
                                                    <span>•</span>
                                                    <span>{pet.age}</span>
                                                    <span>•</span>
                                                    <span className="capitalize">{pet.gender}</span>
                                                </div>
                                            </div>
                                            {pet.location && (
                                                <div className="flex items-center text-gray-400 text-sm mb-3">
                                                    <FaMapMarkerAlt className="mr-1 text-primary-400" />
                                                    {pet.location}
                                                </div>
                                            )}
                                            <div className="flex items-center space-x-2">
                                                {pet.vaccinated && (
                                                    <span className="badge badge-success text-xs">Vaccinated</span>
                                                )}
                                                {pet.neutered && (
                                                    <span className="badge badge-primary text-xs">Neutered</span>
                                                )}
                                            </div>
                                        </div>
                                        {pet.status === 'available' && (
                                            <div className="px-4 pb-4">
                                                <button className="w-full btn-gradient flex items-center justify-center">
                                                    <FaHeart className="mr-2" /> Adopt Me
                                                </button>
                                            </div>
                                        )}
                                    </Link>
                                ))}
                            </div>
                        ) : (
                            <div className="glass-card p-12 text-center">
                                <p className="text-gray-400 text-lg">No pets found matching your criteria.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Pets;
