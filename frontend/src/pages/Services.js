import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { FaMapMarkerAlt, FaPhone, FaClock, FaStar, FaFilter } from 'react-icons/fa';
import { servicesAPI } from '../services/api';
import { toast } from 'react-toastify';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix Leaflet marker icon
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const Services = () => {
    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('');
    const [selectedService, setSelectedService] = useState(null);

    const serviceTypes = [
        { value: '', label: 'All Services' },
        { value: 'vet', label: 'Veterinary Clinics' },
        { value: 'grooming', label: 'Pet Grooming' },
        { value: 'petshop', label: 'Pet Shops' },
        { value: 'boarding', label: 'Pet Boarding' },
        { value: 'training', label: 'Pet Training' }
    ];

    const typeColors = {
        vet: 'badge-danger',
        grooming: 'badge-primary',
        petshop: 'badge-success',
        boarding: 'badge-warning',
        training: 'badge-primary'
    };

    useEffect(() => {
        fetchServices();
    }, [filter]);

    const fetchServices = async () => {
        setLoading(true);
        try {
            const params = filter ? { type: filter } : {};
            const { data } = await servicesAPI.getAll(params);
            setServices(data);
        } catch (error) {
            console.error('Error:', error);
            toast.error('Failed to load services');
        } finally {
            setLoading(false);
        }
    };

    // Sri Lanka center coordinates
    const mapCenter = [7.8731, 80.7718];

    return (
        <div className="min-h-screen py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-3xl md:text-4xl font-bold font-display mb-4">
                        Find Pet <span className="gradient-text">Services</span> Near You
                    </h1>
                    <p className="text-gray-400 text-lg">
                        Discover veterinary clinics, groomers, pet shops, and more
                    </p>
                </div>

                {/* Filter */}
                <div className="flex items-center justify-center mb-8">
                    <div className="flex items-center glass-card p-2 space-x-2">
                        <FaFilter className="text-gray-400 ml-2" />
                        {serviceTypes.map((type) => (
                            <button
                                key={type.value}
                                onClick={() => setFilter(type.value)}
                                className={`px-4 py-2 rounded-lg transition-all ${filter === type.value
                                        ? 'bg-gradient-to-r from-primary-500 to-secondary-500 text-white'
                                        : 'text-gray-400 hover:text-white hover:bg-white/10'
                                    }`}
                            >
                                {type.label}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="grid lg:grid-cols-2 gap-8">
                    {/* Map */}
                    <div className="glass-card p-4 h-[500px] lg:h-auto">
                        <MapContainer
                            center={mapCenter}
                            zoom={8}
                            className="h-full w-full rounded-xl"
                            style={{ minHeight: '450px' }}
                        >
                            <TileLayer
                                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                attribution='&copy; OpenStreetMap contributors'
                            />
                            {services.map((service) => (
                                service.location && (
                                    <Marker
                                        key={service._id}
                                        position={[service.location.lat, service.location.lng]}
                                        eventHandlers={{
                                            click: () => setSelectedService(service)
                                        }}
                                    >
                                        <Popup>
                                            <div className="text-black">
                                                <strong>{service.name}</strong>
                                                <br />
                                                <span className="text-sm">{service.address}</span>
                                            </div>
                                        </Popup>
                                    </Marker>
                                )
                            ))}
                        </MapContainer>
                    </div>

                    {/* Services List */}
                    <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
                        {loading ? (
                            [...Array(4)].map((_, i) => (
                                <div key={i} className="glass-card p-4 animate-pulse">
                                    <div className="h-4 bg-white/10 rounded w-1/2 mb-2"></div>
                                    <div className="h-4 bg-white/10 rounded w-3/4"></div>
                                </div>
                            ))
                        ) : services.length > 0 ? (
                            services.map((service) => (
                                <div
                                    key={service._id}
                                    className={`glass-card p-4 cursor-pointer transition-all ${selectedService?._id === service._id ? 'border-primary-500' : ''
                                        }`}
                                    onClick={() => setSelectedService(service)}
                                >
                                    <div className="flex items-start gap-4">
                                        <img
                                            src={service.image || 'https://via.placeholder.com/80?text=Service'}
                                            alt={service.name}
                                            className="w-20 h-20 object-cover rounded-xl"
                                        />
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-1">
                                                <h3 className="font-semibold text-white">{service.name}</h3>
                                                <span className={`badge text-xs ${typeColors[service.type] || 'badge-primary'}`}>
                                                    {service.type}
                                                </span>
                                            </div>
                                            <div className="flex items-center text-amber-400 text-sm mb-2">
                                                <FaStar className="mr-1" />
                                                <span>{service.rating || '4.5'}</span>
                                                <span className="text-gray-500 ml-1">({service.numReviews || 0} reviews)</span>
                                            </div>
                                            <div className="flex items-center text-gray-400 text-sm mb-1">
                                                <FaMapMarkerAlt className="mr-2 text-primary-400" />
                                                {service.address}
                                            </div>
                                            {service.phone && (
                                                <div className="flex items-center text-gray-400 text-sm mb-1">
                                                    <FaPhone className="mr-2 text-primary-400" />
                                                    {service.phone}
                                                </div>
                                            )}
                                            {service.openHours && (
                                                <div className="flex items-center text-gray-400 text-sm">
                                                    <FaClock className="mr-2 text-primary-400" />
                                                    {service.openHours}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="glass-card p-12 text-center">
                                <p className="text-gray-400">No services found in this category.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Services;
