import React, { useState, useEffect } from 'react';
import { FaPlus, FaEdit, FaTrash } from 'react-icons/fa';
import { servicesAPI } from '../../services/api';
import { toast } from 'react-toastify';
import Swal from 'sweetalert2';

const Services = () => {
    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editing, setEditing] = useState(null);
    const [formData, setFormData] = useState({ name: '', type: 'vet', address: '', phone: '', email: '', lat: '', lng: '', openHours: '9:00 AM - 6:00 PM' });

    useEffect(() => { fetchServices(); }, []);

    const fetchServices = async () => {
        try { const { data } = await servicesAPI.getAll(); setServices(data); } catch { toast.error('Failed'); } finally { setLoading(false); }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editing) { await servicesAPI.update(editing._id, formData); toast.success('Updated!'); }
            else { await servicesAPI.create(formData); toast.success('Created!'); }
            setShowModal(false); fetchServices();
        } catch { toast.error('Failed'); }
    };

    const handleEdit = (svc) => { setEditing(svc); setFormData({ name: svc.name, type: svc.type, address: svc.address, phone: svc.phone, email: svc.email, lat: svc.location?.lat, lng: svc.location?.lng, openHours: svc.openHours }); setShowModal(true); };

    const handleDelete = async (id) => {
        const result = await Swal.fire({ title: 'Delete?', icon: 'warning', showCancelButton: true, background: '#1e293b', color: '#fff' });
        if (result.isConfirmed) { await servicesAPI.delete(id); toast.success('Deleted!'); fetchServices(); }
    };

    const typeLabels = { vet: 'Veterinary', grooming: 'Grooming', petshop: 'Pet Shop', boarding: 'Boarding', training: 'Training' };

    return (
        <div className="min-h-screen py-8">
            <div className="max-w-7xl mx-auto px-4">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold font-display">Manage <span className="gradient-text">Services</span></h1>
                    <button onClick={() => { setEditing(null); setFormData({ name: '', type: 'vet', address: '', phone: '', email: '', lat: '', lng: '', openHours: '9:00 AM - 6:00 PM' }); setShowModal(true); }} className="btn-gradient flex items-center"><FaPlus className="mr-2" /> Add Service</button>
                </div>

                {loading ? <div className="flex justify-center py-12"><div className="spinner"></div></div> : (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {services.map((svc) => (
                            <div key={svc._id} className="glass-card p-6">
                                <span className="badge badge-primary mb-2">{typeLabels[svc.type] || svc.type}</span>
                                <h3 className="font-bold text-lg mb-1">{svc.name}</h3>
                                <p className="text-gray-400 text-sm mb-3">{svc.address}</p>
                                <p className="text-gray-400 text-sm mb-3">{svc.phone}</p>
                                <div className="flex space-x-2">
                                    <button onClick={() => handleEdit(svc)} className="flex-1 py-2 rounded-lg bg-primary-500/20 text-primary-400"><FaEdit className="inline mr-1" /> Edit</button>
                                    <button onClick={() => handleDelete(svc._id)} className="flex-1 py-2 rounded-lg bg-red-500/20 text-red-400"><FaTrash className="inline mr-1" /> Delete</button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {showModal && (
                    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                        <div className="glass-card p-8 max-w-lg w-full">
                            <h2 className="text-2xl font-bold mb-6">{editing ? 'Edit' : 'Add'} Service</h2>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <input type="text" placeholder="Name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="input-glass" required />
                                <select value={formData.type} onChange={(e) => setFormData({ ...formData, type: e.target.value })} className="input-glass">
                                    {Object.entries(typeLabels).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                                </select>
                                <input type="text" placeholder="Address" value={formData.address} onChange={(e) => setFormData({ ...formData, address: e.target.value })} className="input-glass" required />
                                <div className="grid grid-cols-2 gap-4">
                                    <input type="text" placeholder="Phone" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} className="input-glass" />
                                    <input type="email" placeholder="Email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className="input-glass" />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <input type="number" step="any" placeholder="Latitude" value={formData.lat} onChange={(e) => setFormData({ ...formData, lat: e.target.value })} className="input-glass" required />
                                    <input type="number" step="any" placeholder="Longitude" value={formData.lng} onChange={(e) => setFormData({ ...formData, lng: e.target.value })} className="input-glass" required />
                                </div>
                                <input type="text" placeholder="Open Hours" value={formData.openHours} onChange={(e) => setFormData({ ...formData, openHours: e.target.value })} className="input-glass" />
                                <div className="flex space-x-4">
                                    <button type="submit" className="flex-1 btn-gradient">Save</button>
                                    <button type="button" onClick={() => setShowModal(false)} className="flex-1 border border-white/20 px-6 py-3 rounded-xl">Cancel</button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Services;
