import React, { useState, useEffect } from 'react';
import { FaPlus, FaEdit, FaTrash } from 'react-icons/fa';
import { petsAPI } from '../../services/api';
import { toast } from 'react-toastify';
import Swal from 'sweetalert2';

const Pets = () => {
    const [pets, setPets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingPet, setEditingPet] = useState(null);
    const [formData, setFormData] = useState({
        name: '', type: 'dog', breed: '', age: '', gender: 'male', description: '', location: '', vaccinated: false, neutered: false
    });

    useEffect(() => { fetchPets(); }, []);

    const fetchPets = async () => {
        try { const { data } = await petsAPI.getAll(); setPets(data); } catch { toast.error('Failed to load'); } finally { setLoading(false); }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingPet) { await petsAPI.update(editingPet._id, formData); toast.success('Updated!'); }
            else { await petsAPI.create(formData); toast.success('Created!'); }
            setShowModal(false); fetchPets();
        } catch { toast.error('Failed'); }
    };

    const handleEdit = (pet) => { setEditingPet(pet); setFormData({ ...pet }); setShowModal(true); };

    const handleDelete = async (id) => {
        const result = await Swal.fire({ title: 'Delete?', icon: 'warning', showCancelButton: true, background: '#1e293b', color: '#fff' });
        if (result.isConfirmed) { await petsAPI.delete(id); toast.success('Deleted!'); fetchPets(); }
    };

    return (
        <div className="min-h-screen py-8">
            <div className="max-w-7xl mx-auto px-4">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold font-display">Manage <span className="gradient-text">Pets</span></h1>
                    <button onClick={() => { setEditingPet(null); setFormData({ name: '', type: 'dog', breed: '', age: '', gender: 'male', description: '', location: '', vaccinated: false, neutered: false }); setShowModal(true); }} className="btn-gradient flex items-center"><FaPlus className="mr-2" /> Add Pet</button>
                </div>

                {loading ? <div className="flex justify-center py-12"><div className="spinner"></div></div> : (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {pets.map((pet) => (
                            <div key={pet._id} className="glass-card overflow-hidden">
                                <img src={pet.image || 'https://via.placeholder.com/300x200'} alt="" className="w-full h-40 object-cover" />
                                <div className="p-4">
                                    <div className="flex justify-between mb-2">
                                        <h3 className="font-bold">{pet.name}</h3>
                                        <span className={`badge ${pet.status === 'available' ? 'badge-success' : pet.status === 'pending' ? 'badge-warning' : 'badge-danger'}`}>{pet.status}</span>
                                    </div>
                                    <p className="text-gray-400 text-sm mb-3">{pet.breed} • {pet.age} • {pet.gender}</p>
                                    <div className="flex space-x-2">
                                        <button onClick={() => handleEdit(pet)} className="flex-1 py-2 rounded-lg bg-primary-500/20 text-primary-400"><FaEdit className="inline mr-1" /> Edit</button>
                                        <button onClick={() => handleDelete(pet._id)} className="flex-1 py-2 rounded-lg bg-red-500/20 text-red-400"><FaTrash className="inline mr-1" /> Delete</button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {showModal && (
                    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                        <div className="glass-card p-8 max-w-lg w-full max-h-[90vh] overflow-y-auto">
                            <h2 className="text-2xl font-bold mb-6">{editingPet ? 'Edit' : 'Add'} Pet</h2>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <input type="text" placeholder="Name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="input-glass" required />
                                <div className="grid grid-cols-2 gap-4">
                                    <select value={formData.type} onChange={(e) => setFormData({ ...formData, type: e.target.value })} className="input-glass">
                                        {['dog', 'cat', 'bird', 'fish', 'rabbit', 'hamster', 'other'].map(t => <option key={t} value={t}>{t}</option>)}
                                    </select>
                                    <select value={formData.gender} onChange={(e) => setFormData({ ...formData, gender: e.target.value })} className="input-glass">
                                        <option value="male">Male</option><option value="female">Female</option>
                                    </select>
                                </div>
                                <input type="text" placeholder="Breed" value={formData.breed} onChange={(e) => setFormData({ ...formData, breed: e.target.value })} className="input-glass" />
                                <input type="text" placeholder="Age (e.g., 2 years)" value={formData.age} onChange={(e) => setFormData({ ...formData, age: e.target.value })} className="input-glass" required />
                                <textarea placeholder="Description" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} className="input-glass h-20" />
                                <input type="text" placeholder="Location" value={formData.location} onChange={(e) => setFormData({ ...formData, location: e.target.value })} className="input-glass" />
                                <div className="flex space-x-6">
                                    <label className="flex items-center"><input type="checkbox" checked={formData.vaccinated} onChange={(e) => setFormData({ ...formData, vaccinated: e.target.checked })} className="mr-2" /> Vaccinated</label>
                                    <label className="flex items-center"><input type="checkbox" checked={formData.neutered} onChange={(e) => setFormData({ ...formData, neutered: e.target.checked })} className="mr-2" /> Neutered</label>
                                </div>
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

export default Pets;
