import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiMessageCircle, FiX, FiSend, FiRefreshCw } from 'react-icons/fi';
import { FaPaw, FaShoppingCart } from 'react-icons/fa';
import { chatbotAPI } from '../services/api';

const Chatbot = () => {
    const [isOpen, setIsOpen] = useState(false);
    const initialMessage = {
        role: 'assistant',
        content: 'Hello! I\'m your pet care assistant. How can I help you today?'
    };
    const [messages, setMessages] = useState([initialMessage]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!input.trim() || loading) return;

        const userMessage = input.trim();
        setInput('');
        setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
        setLoading(true);

        try {
            const history = messages.map(m => ({
                role: m.role === 'assistant' ? 'ai' : 'human',
                content: m.content
            }));

            const response = await chatbotAPI.sendMessage(userMessage, history);
            setMessages(prev => [...prev, {
                role: 'assistant',
                content: response.response,
                products: response.products || []
            }]);
        } catch (error) {
            console.error('Chatbot error:', error);
            setMessages(prev => [...prev, {
                role: 'assistant',
                content: 'Sorry, I\'m having trouble connecting right now. Please try again later! 🙏'
            }]);
        } finally {
            setLoading(false);
        }
    };

    const handleNewChat = () => {
        setMessages([initialMessage]);
        setInput('');
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSubmit(e);
        }
    };

    return (
        <div className="chatbot-container">
            {/* Chat Window */}
            {isOpen && (
                <div className="chatbot-window animate-in slide-in-from-bottom-4">
                    {/* Header */}
                    <div className="bg-gradient-to-r from-primary-600 to-secondary-600 p-4 flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                                <FaPaw className="text-white text-lg" />
                            </div>
                            <div>
                                <h3 className="text-white font-semibold">Pet Care AI</h3>
                                <p className="text-white/70 text-xs">Always here to help</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <button
                                onClick={handleNewChat}
                                className="text-white/70 hover:text-white transition-colors p-2 hover:bg-white/10 rounded-lg"
                                title="New Chat"
                            >
                                <FiRefreshCw size={18} />
                            </button>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="text-white/70 hover:text-white transition-colors"
                            >
                                <FiX size={24} />
                            </button>
                        </div>
                    </div>

                    {/* Messages */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-4">
                        {messages.map((message, index) => (
                            <div key={index}>
                                <div
                                    className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                                >
                                    <div
                                        className={`max-w-[80%] px-4 py-2 rounded-2xl ${message.role === 'user'
                                            ? 'bg-gradient-to-r from-primary-500 to-secondary-500 text-white rounded-br-none'
                                            : 'bg-white/10 text-gray-200 rounded-bl-none'
                                            }`}
                                    >
                                        <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                                    </div>
                                </div>

                                {/* Product Cards */}
                                {message.products && message.products.length > 0 && (
                                    <div className="mt-3 space-y-2">
                                        {message.products.map((product) => (
                                            <Link
                                                key={product._id}
                                                to={`/products/${product._id}`}
                                                className="flex items-center gap-3 p-3 bg-white/5 hover:bg-white/10 rounded-xl border border-white/10 transition-all group"
                                            >
                                                <img
                                                    src={product.image}
                                                    alt={product.name}
                                                    className="w-16 h-16 object-cover rounded-lg"
                                                />
                                                <div className="flex-1 min-w-0">
                                                    <h4 className="text-sm font-semibold text-white group-hover:text-primary-400 transition-colors truncate">
                                                        {product.name}
                                                    </h4>
                                                    <p className="text-xs text-gray-400">
                                                        {product.brand} • {product.category}
                                                    </p>
                                                    <div className="flex items-center justify-between mt-1">
                                                        <span className="text-primary-400 font-bold text-sm">
                                                            Rs. {product.price}
                                                        </span>
                                                        <span className="text-xs text-green-400">
                                                            {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
                                                        </span>
                                                    </div>
                                                </div>
                                                <FaShoppingCart className="text-primary-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                                            </Link>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ))}
                        {loading && (
                            <div className="flex justify-start">
                                <div className="bg-white/10 px-4 py-3 rounded-2xl rounded-bl-none">
                                    <div className="flex space-x-1">
                                        <div className="w-2 h-2 bg-primary-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                                        <div className="w-2 h-2 bg-primary-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                                        <div className="w-2 h-2 bg-primary-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                                    </div>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input */}
                    <form onSubmit={handleSubmit} className="p-4 border-t border-white/10">
                        <div className="flex items-center space-x-2">
                            <input
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyPress={handleKeyPress}
                                placeholder="Ask about pet care..."
                                className="input-glass flex-1"
                                disabled={loading}
                            />
                            <button
                                type="submit"
                                disabled={loading || !input.trim()}
                                className="w-12 h-12 rounded-full bg-gradient-to-r from-primary-500 to-secondary-500 flex items-center justify-center text-white disabled:opacity-50 hover:opacity-90 transition-opacity"
                            >
                                <FiSend />
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* Toggle Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="chatbot-button"
            >
                {isOpen ? (
                    <FiX className="text-2xl text-white" />
                ) : (
                    <FiMessageCircle className="text-2xl text-white" />
                )}
            </button>
        </div>
    );
};

export default Chatbot;
