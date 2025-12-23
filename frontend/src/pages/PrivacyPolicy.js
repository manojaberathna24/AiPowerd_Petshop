import React from 'react';
import { FaShieldAlt } from 'react-icons/fa';

const PrivacyPolicy = () => {
    return (
        <div className="min-h-screen py-12">
            <div className="max-w-4xl mx-auto px-4">
                <div className="glass-card p-8">
                    <div className="flex items-center gap-3 mb-6">
                        <FaShieldAlt className="text-4xl text-primary-400" />
                        <h1 className="text-3xl font-bold">Privacy Policy</h1>
                    </div>

                    <p className="text-gray-400 mb-8">Last updated: December 22, 2025</p>

                    <div className="space-y-6 text-gray-300">
                        <section>
                            <h2 className="text-xl font-semibold text-white mb-3">1. Information We Collect</h2>
                            <p>We collect information you provide directly to us, including:</p>
                            <ul className="list-disc list-inside ml-4 mt-2 space-y-1">
                                <li>Name, email address, and phone number</li>
                                <li>Pet information (name, breed, age)</li>
                                <li>Order and adoption history</li>
                                <li>Payment information (processed securely)</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold text-white mb-3">2. How We Use Your Information</h2>
                            <p>We use the information we collect to:</p>
                            <ul className="list-disc list-inside ml-4 mt-2 space-y-1">
                                <li>Process your orders and adoption applications</li>
                                <li>Provide customer support</li>
                                <li>Send you updates about your orders</li>
                                <li>Improve our services and user experience</li>
                                <li>Comply with legal obligations</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold text-white mb-3">3. Information Sharing</h2>
                            <p>We do not sell, trade, or rent your personal information to third parties. We may share your information only with:</p>
                            <ul className="list-disc list-inside ml-4 mt-2 space-y-1">
                                <li>Service providers who assist in operating our platform</li>
                                <li>Payment processors for secure transactions</li>
                                <li>Law enforcement when required by law</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold text-white mb-3">4. Data Security</h2>
                            <p>We implement appropriate security measures to protect your personal information. However, no method of transmission over the Internet is 100% secure.</p>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold text-white mb-3">5. Your Rights</h2>
                            <p>You have the right to:</p>
                            <ul className="list-disc list-inside ml-4 mt-2 space-y-1">
                                <li>Access your personal data</li>
                                <li>Correct inaccurate data</li>
                                <li>Request deletion of your data</li>
                                <li>Opt-out of marketing communications</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold text-white mb-3">6. Contact Us</h2>
                            <p>If you have questions about this Privacy Policy, please contact us at:</p>
                            <p className="mt-2">Email: privacy@mpspetcare.lk</p>
                            <p>Phone: +94 11 234 5678</p>
                        </section>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PrivacyPolicy;
