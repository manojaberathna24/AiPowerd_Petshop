import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaCheck, FaCreditCard, FaMoneyBill } from 'react-icons/fa';
import { useCart } from '../context/CartContext';
import { ordersAPI } from '../services/api';
import { toast } from 'react-toastify';
import Swal from 'sweetalert2';
import axios from 'axios';

const Checkout = () => {
    const navigate = useNavigate();
    const { cartItems, getCartTotal, clearCart } = useCart();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        fullName: '',
        address: '',
        city: '',
        postalCode: '',
        phone: '',
        paymentMethod: 'cod'
    });

    const shippingPrice = getCartTotal() > 5000 ? 0 : 350;
    const totalPrice = getCartTotal() + shippingPrice;

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const initiatePayHerePayment = async (orderId) => {
        try {
            const token = localStorage.getItem('token');
            const { data } = await axios.post(
                'http://localhost:5000/api/payments/initiate',
                { orderId },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            // Create PayHere form and submit
            const form = document.createElement('form');
            form.method = 'POST';
            form.action = data.payhere_url;

            const fields = [
                'merchant_id', 'return_url', 'cancel_url', 'notify_url',
                'order_id', 'items', 'currency', 'amount',
                'first_name', 'last_name', 'email', 'phone',
                'address', 'city', 'country', 'hash'
            ];

            fields.forEach(field => {
                const input = document.createElement('input');
                input.type = 'hidden';
                input.name = field;
                input.value = data[field] || '';
                form.appendChild(input);
            });

            document.body.appendChild(form);
            form.submit();
        } catch (error) {
            toast.error('Payment initialization failed');
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const orderData = {
                items: cartItems.map(item => ({
                    product: item._id,
                    name: item.name,
                    image: item.image,
                    price: item.price,
                    quantity: item.quantity
                })),
                shippingAddress: {
                    fullName: formData.fullName,
                    address: formData.address,
                    city: formData.city,
                    postalCode: formData.postalCode,
                    phone: formData.phone
                },
                paymentMethod: formData.paymentMethod,
                totalPrice,
                shippingPrice
            };

            const { data: order } = await ordersAPI.create(orderData);

            if (formData.paymentMethod === 'card') {
                // PayHere online payment
                await initiatePayHerePayment(order._id);
            } else {
                // Cash on delivery or bank transfer
                clearCart();
                Swal.fire({
                    icon: 'success',
                    title: 'Order Placed!',
                    text: formData.paymentMethod === 'cod'
                        ? 'Your order has been placed. Pay when you receive it.'
                        : 'Your order has been placed. Please complete the bank transfer.',
                    background: '#1e293b',
                    color: '#fff'
                }).then(() => {
                    navigate('/my-orders');
                });
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to place order');
            setLoading(false);
        }
    };

    if (cartItems.length === 0) {
        navigate('/cart');
        return null;
    }

    return (
        <div className="min-h-screen py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <h1 className="text-3xl font-bold font-display mb-8">
                    <span className="gradient-text">Checkout</span>
                </h1>

                <form onSubmit={handleSubmit}>
                    <div className="grid lg:grid-cols-3 gap-8">
                        {/* Shipping Form */}
                        <div className="lg:col-span-2 space-y-6">
                            <div className="glass-card p-6">
                                <h2 className="text-xl font-bold mb-6">Shipping Address</h2>
                                <div className="grid md:grid-cols-2 gap-4">
                                    <div className="md:col-span-2">
                                        <label className="block text-sm text-gray-400 mb-2">Full Name</label>
                                        <input
                                            type="text"
                                            name="fullName"
                                            value={formData.fullName}
                                            onChange={handleChange}
                                            className="input-glass"
                                            required
                                        />
                                    </div>
                                    <div className="md:col-span-2">
                                        <label className="block text-sm text-gray-400 mb-2">Address</label>
                                        <input
                                            type="text"
                                            name="address"
                                            value={formData.address}
                                            onChange={handleChange}
                                            className="input-glass"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm text-gray-400 mb-2">City</label>
                                        <input
                                            type="text"
                                            name="city"
                                            value={formData.city}
                                            onChange={handleChange}
                                            className="input-glass"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm text-gray-400 mb-2">Postal Code</label>
                                        <input
                                            type="text"
                                            name="postalCode"
                                            value={formData.postalCode}
                                            onChange={handleChange}
                                            className="input-glass"
                                            required
                                        />
                                    </div>
                                    <div className="md:col-span-2">
                                        <label className="block text-sm text-gray-400 mb-2">Phone Number</label>
                                        <input
                                            type="tel"
                                            name="phone"
                                            value={formData.phone}
                                            onChange={handleChange}
                                            className="input-glass"
                                            required
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="glass-card p-6">
                                <h2 className="text-xl font-bold mb-6">Payment Method</h2>
                                <div className="space-y-3">
                                    {/* Cash on Delivery */}
                                    <label className={`flex items-center p-4 border rounded-xl cursor-pointer transition-all ${formData.paymentMethod === 'cod'
                                            ? 'border-primary-500 bg-primary-500/10'
                                            : 'border-white/10 hover:bg-white/5'
                                        }`}>
                                        <input
                                            type="radio"
                                            name="paymentMethod"
                                            value="cod"
                                            checked={formData.paymentMethod === 'cod'}
                                            onChange={handleChange}
                                            className="mr-3"
                                        />
                                        <FaMoneyBill className="mr-3 text-green-400 text-xl" />
                                        <div>
                                            <span className="font-semibold">Cash on Delivery</span>
                                            <p className="text-sm text-gray-400">Pay when you receive</p>
                                        </div>
                                    </label>

                                    {/* Online Payment (PayHere) */}
                                    <label className={`flex items-center p-4 border rounded-xl cursor-pointer transition-all ${formData.paymentMethod === 'card'
                                            ? 'border-primary-500 bg-primary-500/10'
                                            : 'border-white/10 hover:bg-white/5'
                                        }`}>
                                        <input
                                            type="radio"
                                            name="paymentMethod"
                                            value="card"
                                            checked={formData.paymentMethod === 'card'}
                                            onChange={handleChange}
                                            className="mr-3"
                                        />
                                        <FaCreditCard className="mr-3 text-blue-400 text-xl" />
                                        <div>
                                            <span className="font-semibold">Pay Online (PayHere)</span>
                                            <p className="text-sm text-gray-400">Visa, Master, Amex, or Bank Transfer</p>
                                        </div>
                                    </label>
                                </div>
                            </div>
                        </div>

                        {/* Order Summary */}
                        <div className="lg:col-span-1">
                            <div className="glass-card p-6 sticky top-24">
                                <h3 className="text-xl font-bold mb-6">Order Summary</h3>

                                <div className="space-y-3 mb-6">
                                    {cartItems.map((item) => (
                                        <div key={item._id} className="flex justify-between text-sm">
                                            <span className="text-gray-400">{item.name} x{item.quantity}</span>
                                            <span>Rs. {item.price * item.quantity}</span>
                                        </div>
                                    ))}
                                </div>

                                <hr className="border-white/10 my-4" />

                                <div className="space-y-2 mb-6">
                                    <div className="flex justify-between text-gray-400">
                                        <span>Subtotal</span>
                                        <span>Rs. {getCartTotal()}</span>
                                    </div>
                                    <div className="flex justify-between text-gray-400">
                                        <span>Shipping</span>
                                        <span>{shippingPrice === 0 ? 'Free' : `Rs. ${shippingPrice}`}</span>
                                    </div>
                                    <hr className="border-white/10" />
                                    <div className="flex justify-between text-xl font-bold">
                                        <span>Total</span>
                                        <span className="text-primary-400">Rs. {totalPrice}</span>
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full btn-gradient flex items-center justify-center py-3 disabled:opacity-50"
                                >
                                    {loading ? (
                                        <div className="spinner w-5 h-5"></div>
                                    ) : formData.paymentMethod === 'card' ? (
                                        <>
                                            <FaCreditCard className="mr-2" /> Pay Now
                                        </>
                                    ) : (
                                        <>
                                            <FaCheck className="mr-2" /> Place Order
                                        </>
                                    )}
                                </button>

                                {formData.paymentMethod === 'card' && (
                                    <p className="text-xs text-gray-400 text-center mt-3">
                                        Secured by PayHere 🔒
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Checkout;
