import React from 'react';
import { FaCookie } from 'react-icons/fa';

const CookiePolicy = () => {
    return (
        <div className="min-h-screen py-12">
            <div className="max-w-4xl mx-auto px-4">
                <div className="glass-card p-8">
                    <div className="flex items-center gap-3 mb-6">
                        <FaCookie className="text-4xl text-primary-400" />
                        <h1 className="text-3xl font-bold">Cookie Policy</h1>
                    </div>

                    <p className="text-gray-400 mb-8">Last updated: December 22, 2025</p>

                    <div className="space-y-6 text-gray-300">
                        <section>
                            <h2 className="text-xl font-semibold text-white mb-3">What Are Cookies?</h2>
                            <p>Cookies are small text files that are placed on your device when you visit our website. They help us provide you with a better experience.</p>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold text-white mb-3">How We Use Cookies</h2>
                            <p>We use cookies for:</p>
                            <ul className="list-disc list-inside ml-4 mt-2 space-y-1">
                                <li><strong>Essential Cookies:</strong> Required for the website to function (login, cart)</li>
                                <li><strong>Preference Cookies:</strong> Remember your settings (theme, language)</li>
                                <li><strong>Analytics Cookies:</strong> Help us understand how you use our site</li>
                                <li><strong>Marketing Cookies:</strong> Used to show relevant advertisements</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold text-white mb-3">Types of Cookies We Use</h2>

                            <div className="mt-4">
                                <h3 className="font-semibold text-white mb-2">Session Cookies</h3>
                                <p>Temporary cookies that expire when you close your browser. Used for authentication and cart management.</p>
                            </div>

                            <div className="mt-4">
                                <h3 className="font-semibold text-white mb-2">Persistent Cookies</h3>
                                <p>Remain on your device for a set period. Used to remember your preferences and login status.</p>
                            </div>

                            <div className="mt-4">
                                <h3 className="font-semibold text-white mb-2">Third-Party Cookies</h3>
                                <p>Set by external services like Google Analytics and payment processors.</p>
                            </div>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold text-white mb-3">Managing Cookies</h2>
                            <p>You can control cookies through your browser settings:</p>
                            <ul className="list-disc list-inside ml-4 mt-2 space-y-1">
                                <li>Block all cookies</li>
                                <li>Delete cookies after browsing</li>
                                <li>Allow cookies from specific websites</li>
                            </ul>
                            <p className="mt-3 text-yellow-400">Note: Blocking cookies may affect website functionality.</p>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold text-white mb-3">Cookie Duration</h2>
                            <ul className="list-disc list-inside ml-4 mt-2 space-y-1">
                                <li><strong>Session cookies:</strong> Until browser is closed</li>
                                <li><strong>Authentication cookies:</strong> 30 days</li>
                                <li><strong>Preference cookies:</strong> 1 year</li>
                                <li><strong>Analytics cookies:</strong> 2 years</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold text-white mb-3">Contact Us</h2>
                            <p>Questions about our cookie policy?</p>
                            <p className="mt-2">Email: privacy@mpspetcare.lk</p>
                            <p>Phone: +94 11 234 5678</p>
                        </section>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CookiePolicy;
