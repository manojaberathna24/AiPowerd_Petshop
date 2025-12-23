import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'react-toastify';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const storedCart = localStorage.getItem('cart');
        if (storedCart) {
            setCartItems(JSON.parse(storedCart));
        }
        setLoading(false);
    }, []);

    useEffect(() => {
        if (!loading) {
            localStorage.setItem('cart', JSON.stringify(cartItems));
        }
    }, [cartItems, loading]);

    const addToCart = (product, quantity = 1) => {
        setCartItems(prevItems => {
            const existingItem = prevItems.find(item => item._id === product._id);

            if (existingItem) {
                const newQuantity = existingItem.quantity + quantity;
                if (newQuantity > product.stock) {
                    toast.warning('Cannot add more than available stock');
                    return prevItems;
                }
                toast.success('Cart updated! 🛒');
                return prevItems.map(item =>
                    item._id === product._id
                        ? { ...item, quantity: newQuantity }
                        : item
                );
            } else {
                if (quantity > product.stock) {
                    toast.warning('Not enough stock available');
                    return prevItems;
                }
                toast.success('Added to cart! 🛒');
                return [...prevItems, { ...product, quantity }];
            }
        });
    };

    const removeFromCart = (productId) => {
        setCartItems(prevItems => prevItems.filter(item => item._id !== productId));
        toast.info('Item removed from cart');
    };

    const updateQuantity = (productId, quantity) => {
        if (quantity < 1) {
            removeFromCart(productId);
            return;
        }

        setCartItems(prevItems =>
            prevItems.map(item =>
                item._id === productId
                    ? { ...item, quantity }
                    : item
            )
        );
    };

    const clearCart = () => {
        setCartItems([]);
        localStorage.removeItem('cart');
    };

    const getCartTotal = () => {
        return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
    };

    const getCartCount = () => {
        return cartItems.reduce((count, item) => count + item.quantity, 0);
    };

    const value = {
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getCartTotal,
        getCartCount,
        loading
    };

    return (
        <CartContext.Provider value={value}>
            {!loading && children}
        </CartContext.Provider>
    );
};
