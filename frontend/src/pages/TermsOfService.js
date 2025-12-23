import React from 'react';
import { FaFileContract } from 'react-icons/fa';

const TermsOfService = () => {
    return (
        <div className="min-h-screen py-12">
            <div className="max-w-4xl mx-auto px-4">
                <div className="glass-card p-8">
                    <div className="flex items-center gap-3 mb-6">
                        <FaFileContract className="text-4xl text-primary-400" />
                        <h1 className="text-3xl font-bold">Terms of Service</h1>
                    </div>

                    <p className="text-gray-400 mb-8">Last updated: December 22, 2025</p>

                    <div className="space-y-6 text-gray-300">
                        <section>
                            <h2 className="text-xl font-semibold text-white mb-3">1. Acceptance of Terms</h2>
                            <p>By accessing and using MPS PetCare, you accept and agree to be bound by these Terms of Service.</p>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold text-white mb-3">2. User Accounts</h2>
                            <p>You are responsible for:</p>
                            <ul className="list-disc list-inside ml-4 mt-2 space-y-1">
                                <li>Maintaining the confidentiality of your account</li>
                                <li>All activities that occur under your account</li>
                                <li>Providing accurate and complete information</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold text-white mb-3">3. Pet Adoption</h2>
                            <p>When adopting a pet through our platform:</p>
                            <ul className="list-disc list-inside ml-4 mt-2 space-y-1">
                                <li>You must provide accurate information about your living situation</li>
                                <li>You agree to provide proper care for the adopted pet</li>
                                <li>Adoption fees are non-refundable</li>
                                <li>We reserve the right to deny any adoption application</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold text-white mb-3">4. Product Orders</h2>
                            <p>For product purchases:</p>
                            <ul className="list-disc list-inside ml-4 mt-2 space-y-1">
                                <li>All prices are in Sri Lankan Rupees (LKR)</li>
                                <li>Payment must be completed before order processing</li>
                                <li>Delivery times are estimates and not guaranteed</li>
                                <li>Returns accepted within 7 days for unopened items</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold text-white mb-3">5. Prohibited Activities</h2>
                            <p>You may not:</p>
                            <ul className="list-disc list-inside ml-4 mt-2 space-y-1">
                                <li>Use the service for any illegal purpose</li>
                                <li>Misrepresent yourself or provide false information</li>
                                <li>Interfere with the proper functioning of the platform</li>
                                <li>Attempt to gain unauthorized access to our systems</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold text-white mb-3">6. Limitation of Liability</h2>
                            <p>MPS PetCare shall not be liable for any indirect, incidental, special, or consequential damages resulting from your use of our service.</p>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold text-white mb-3">7. Contact</h2>
                            <p>For questions about these Terms, contact us at:</p>
                            <p className="mt-2">Email: support@mpspetcare.lk</p>
                            <p>Phone: +94 11 234 5678</p>
                        </section>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TermsOfService;
