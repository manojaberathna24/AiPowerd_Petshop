import React, { useState, useEffect } from 'react';
import { FaPlus, FaEdit, FaTrash } from 'react-icons/fa';
import { productsAPI } from '../../services/api';
import { toast } from 'react-toastify';
import Swal from 'sweetalert2';

const Products = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    const [formData, setFormData] = useState({
        name: '', description: '', price: '', category: 'food', petType: 'all', stock: '', brand: ''
    });

    const categories = ['food', 'toys', 'accessories', 'medicine', 'grooming', 'other'];

    useEffect(() => { fetchProducts(); }, []);

    const fetchProducts = async () => {
        try {
            const { data } = await productsAPI.getAll();
            setProducts(data);
        } catch (error) {
            toast.error('Failed to load products');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingProduct) {
                await productsAPI.update(editingProduct._id, formData);
                toast.success('Product updated!');
            } else {
                await productsAPI.create(formData);
                toast.success('Product created!');
            }
            setShowModal(false);
            resetForm();
            fetchProducts();
        } catch (error) {
            toast.error('Operation failed');
        }
    };

    const handleEdit = (product) => {
        setEditingProduct(product);
        setFormData({
            name: product.name, description: product.description, price: product.price,
            category: product.category, petType: product.petType, stock: product.stock, brand: product.brand
        });
        setShowModal(true);
    };

    const handleDelete = async (id) => {
        const result = await Swal.fire({
            title: 'Delete Product?', text: 'This cannot be undone!', icon: 'warning',
            showCancelButton: true, confirmButtonColor: '#ef4444', background: '#1e293b', color: '#fff'
        });
        if (result.isConfirmed) {
            try {
                await productsAPI.delete(id);
                toast.success('Product deleted!');
                fetchProducts();
            } catch (error) {
                toast.error('Failed to delete');
            }
        }
    };

    const resetForm = () => {
        setFormData({ name: '', description: '', price: '', category: 'food', petType: 'all', stock: '', brand: '' });
        setEditingProduct(null);
    };

    return (
        <div className="min-h-screen py-8">
            <div className="max-w-7xl mx-auto px-4">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold font-display">Manage <span className="gradient-text">Products</span></h1>
                    <button onClick={() => { resetForm(); setShowModal(true); }} className="btn-gradient flex items-center">
                        <FaPlus className="mr-2" /> Add Product
                    </button>
                </div>

                {loading ? (
                    <div className="flex justify-center py-12"><div className="spinner"></div></div>
                ) : (
                    <div className="glass-card overflow-hidden">
                        <table className="w-full">
                            <thead className="bg-white/5">
                                <tr>
                                    <th className="px-4 py-3 text-left">Product</th>
                                    <th className="px-4 py-3 text-left">Category</th>
                                    <th className="px-4 py-3 text-left">Price</th>
                                    <th className="px-4 py-3 text-left">Stock</th>
                                    <th className="px-4 py-3 text-left">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {products.map((product) => (
                                    <tr key={product._id} className="border-t border-white/10">
                                        <td className="px-4 py-3">
                                            <div className="flex items-center">
                                                <img src={product.image || 'https://via.placeholder.com/40'} alt="" className="w-10 h-10 rounded-lg mr-3" />
                                                <span>{product.name}</span>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3"><span className="badge badge-primary capitalize">{product.category}</span></td>
                                        <td className="px-4 py-3">Rs. {product.price}</td>
                                        <td className="px-4 py-3"><span className={product.stock > 0 ? 'text-green-400' : 'text-red-400'}>{product.stock}</span></td>
                                        <td className="px-4 py-3">
                                            <button onClick={() => handleEdit(product)} className="text-primary-400 hover:text-primary-300 mr-3"><FaEdit /></button>
                                            <button onClick={() => handleDelete(product._id)} className="text-red-400 hover:text-red-300"><FaTrash /></button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {showModal && (
                    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                        <div className="glass-card p-8 max-w-lg w-full">
                            <h2 className="text-2xl font-bold mb-6">{editingProduct ? 'Edit' : 'Add'} Product</h2>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <input type="text" placeholder="Name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="input-glass" required />
                                <textarea placeholder="Description" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} className="input-glass h-20" required />
                                <div className="grid grid-cols-2 gap-4">
                                    <input type="number" placeholder="Price" value={formData.price} onChange={(e) => setFormData({ ...formData, price: e.target.value })} className="input-glass" required />
                                    <input type="number" placeholder="Stock" value={formData.stock} onChange={(e) => setFormData({ ...formData, stock: e.target.value })} className="input-glass" required />
                                </div>
                                <select value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })} className="input-glass">
                                    {categories.map(c => <option key={c} value={c}>{c}</option>)}
                                </select>
                                <input type="text" placeholder="Brand (optional)" value={formData.brand} onChange={(e) => setFormData({ ...formData, brand: e.target.value })} className="input-glass" />
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

export default Products;
