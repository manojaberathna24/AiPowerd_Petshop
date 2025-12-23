import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Chatbot from './components/Chatbot';
import ThemeToggle from './components/ThemeToggle';
import Home from './pages/Home';
import Products from './pages/Products';
import ProductDetail from './pages/ProductDetail';
import Pets from './pages/Pets';
import PetDetail from './pages/PetDetail';
import Services from './pages/Services';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Login from './pages/Login';
import Register from './pages/Register';
import AdminSetup from './pages/AdminSetup';
import Profile from './pages/Profile';
import MyOrders from './pages/MyOrders';
import MyPets from './pages/MyPets';
import LostFound from './pages/LostFound';
import Forum from './pages/Forum';
import Offers from './pages/Offers';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsOfService from './pages/TermsOfService';
import CookiePolicy from './pages/CookiePolicy';
import AdminDashboard from './pages/admin/Dashboard';
import AdminProducts from './pages/admin/Products';
import AdminPets from './pages/admin/Pets';
import AdminOrders from './pages/admin/Orders';
import AdminUsers from './pages/admin/Users';
import AdminServices from './pages/admin/Services';
import AdminAdoptions from './pages/admin/Adoptions';
import AdminOffers from './pages/admin/Offers';
import PaymentSuccess from './pages/PaymentSuccess';
import PaymentCancel from './pages/PaymentCancel';
import ProtectedRoute from './components/ProtectedRoute';
import AdminRoute from './components/AdminRoute';

function App() {
    return (
        <div className="min-h-screen flex flex-col">
            {/* Background Orbs */}
            <div className="bg-orb bg-orb-1"></div>
            <div className="bg-orb bg-orb-2"></div>
            <div className="bg-orb bg-orb-3"></div>

            <Navbar />

            <main className="flex-grow">
                <Routes>
                    {/* Public Routes */}
                    <Route path="/" element={<Home />} />
                    <Route path="/products" element={<Products />} />
                    <Route path="/products/:id" element={<ProductDetail />} />
                    <Route path="/pets" element={<Pets />} />
                    <Route path="/pets/:id" element={<PetDetail />} />
                    <Route path="/services" element={<Services />} />
                    <Route path="/lost-found" element={<LostFound />} />
                    <Route path="/forum" element={<Forum />} />
                    <Route path="/offers" element={<Offers />} />
                    <Route path="/privacy-policy" element={<PrivacyPolicy />} />
                    <Route path="/terms-of-service" element={<TermsOfService />} />
                    <Route path="/cookie-policy" element={<CookiePolicy />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/admin-setup" element={<AdminSetup />} />

                    {/* Protected Routes */}
                    <Route path="/cart" element={<ProtectedRoute><Cart /></ProtectedRoute>} />
                    <Route path="/checkout" element={<ProtectedRoute><Checkout /></ProtectedRoute>} />
                    <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
                    <Route path="/my-orders" element={<ProtectedRoute><MyOrders /></ProtectedRoute>} />
                    <Route path="/my-pets" element={<ProtectedRoute><MyPets /></ProtectedRoute>} />
                    <Route path="/payment/success" element={<ProtectedRoute><PaymentSuccess /></ProtectedRoute>} />
                    <Route path="/payment/cancel" element={<ProtectedRoute><PaymentCancel /></ProtectedRoute>} />

                    {/* Admin Routes */}
                    <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
                    <Route path="/admin/products" element={<AdminRoute><AdminProducts /></AdminRoute>} />
                    <Route path="/admin/pets" element={<AdminRoute><AdminPets /></AdminRoute>} />
                    <Route path="/admin/orders" element={<AdminRoute><AdminOrders /></AdminRoute>} />
                    <Route path="/admin/users" element={<AdminRoute><AdminUsers /></AdminRoute>} />
                    <Route path="/admin/services" element={<AdminRoute><AdminServices /></AdminRoute>} />
                    <Route path="/admin/adoptions" element={<AdminRoute><AdminAdoptions /></AdminRoute>} />
                    <Route path="/admin/offers" element={<AdminRoute><AdminOffers /></AdminRoute>} />
                </Routes>
            </main>

            <Footer />
            <Chatbot />
            <ThemeToggle />
        </div>
    );
}

export default App;
