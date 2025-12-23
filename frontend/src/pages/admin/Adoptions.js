import React, { useState, useEffect } from 'react';
import { FaCheck, FaTimes } from 'react-icons/fa';
import { adoptionsAPI } from '../../services/api';
import { toast } from 'react-toastify';
import Swal from 'sweetalert2';

const Adoptions = () => {
    const [adoptions, setAdoptions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('pending');

    useEffect(() => { fetchAdoptions(); }, [filter]);

    const fetchAdoptions = async () => {
        try { const { data } = await adoptionsAPI.getAll({ status: filter }); setAdoptions(data); } catch { toast.error('Failed'); } finally { setLoading(false); }
    };

    const handleApprove = async (id) => {
        const result = await Swal.fire({ title: 'Approve Adoption?', text: 'This will transfer pet ownership', icon: 'question', showCancelButton: true, background: '#1e293b', color: '#fff' });
        if (result.isConfirmed) { await adoptionsAPI.approve(id); toast.success('Approved!'); fetchAdoptions(); }
    };

    const handleReject = async (id) => {
        const { value: note } = await Swal.fire({ title: 'Reject Reason', input: 'textarea', inputPlaceholder: 'Optional note...', showCancelButton: true, background: '#1e293b', color: '#fff' });
        if (note !== undefined) { await adoptionsAPI.reject(id, note); toast.success('Rejected!'); fetchAdoptions(); }
    };

    const statusColors = { pending: 'badge-warning', approved: 'badge-success', rejected: 'badge-danger' };

    return (
        <div className="min-h-screen py-8">
            <div className="max-w-7xl mx-auto px-4">
                <h1 className="text-3xl font-bold font-display mb-8">Manage <span className="gradient-text">Adoptions</span></h1>

                <div className="flex space-x-4 mb-8">
                    {['pending', 'approved', 'rejected'].map((s) => (
                        <button key={s} onClick={() => setFilter(s)} className={`px-6 py-2 rounded-xl capitalize ${filter === s ? 'bg-primary-500 text-white' : 'glass-card text-gray-400'}`}>{s}</button>
                    ))}
                </div>

                {loading ? <div className="flex justify-center py-12"><div className="spinner"></div></div> : (
                    <div className="space-y-4">
                        {adoptions.length === 0 ? (
                            <div className="glass-card p-12 text-center text-gray-400">No {filter} adoption requests</div>
                        ) : adoptions.map((a) => (
                            <div key={a._id} className="glass-card p-6">
                                <div className="flex items-start justify-between">
                                    <div className="flex items-start">
                                        <img src={a.pet?.image || 'https://via.placeholder.com/80'} alt="" className="w-20 h-20 rounded-xl object-cover mr-4" />
                                        <div>
                                            <h3 className="font-bold text-lg">{a.pet?.name}</h3>
                                            <p className="text-gray-400 text-sm">{a.pet?.breed} • {a.pet?.age}</p>
                                            <div className="mt-2">
                                                <p className="text-sm"><strong>Applicant:</strong> {a.user?.name}</p>
                                                <p className="text-sm text-gray-400">{a.user?.email} | {a.user?.phone}</p>
                                            </div>
                                        </div>
                                    </div>
                                    <span className={`badge ${statusColors[a.status]}`}>{a.status}</span>
                                </div>

                                {a.message && <div className="mt-4 p-3 bg-white/5 rounded-lg"><p className="text-sm text-gray-400"><strong>Message:</strong> {a.message}</p></div>}

                                <div className="mt-4 grid grid-cols-3 gap-4 text-sm">
                                    <div><strong>Living:</strong> {a.livingCondition}</div>
                                    <div><strong>Other Pets:</strong> {a.hasOtherPets ? 'Yes' : 'No'}</div>
                                    <div><strong>Children:</strong> {a.hasChildren ? 'Yes' : 'No'}</div>
                                </div>

                                {a.status === 'pending' && (
                                    <div className="mt-4 flex space-x-4">
                                        <button onClick={() => handleApprove(a._id)} className="flex-1 btn-gradient flex items-center justify-center"><FaCheck className="mr-2" /> Approve</button>
                                        <button onClick={() => handleReject(a._id)} className="flex-1 py-3 rounded-xl border border-red-500/50 text-red-400 hover:bg-red-500/10"><FaTimes className="inline mr-2" /> Reject</button>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Adoptions;
