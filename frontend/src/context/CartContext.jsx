/**
 * Contexto de Carrito de Compras para la Aplicación E-commerce ELAIA
 * 
 * Este archivo proporciona un sistema completo de carrito de compras usando React Context API.
 * Maneja agregar/quitar productos, actualizar cantidades, calcular totales,
 * y gestionar el estado del carrito en toda la aplicación.
 * 
 * Características Principales:
 * - Agregar productos al carrito con gestión automática de cantidades
 * - Quitar productos del carrito
 * - Actualizar cantidades de productos (con eliminación automática para cantidades cero)
 * - Limpiar todo el carrito
 * - Calcular total de ítems y precio total
 * - Soporte para diferentes tipos de productos (batas, cosmetiqueros, etc.)
 * - Estado de carrito persistente durante la sesión
 * 
 * @author Equipo de Desarrollo ELAIA
 * @version 1.0.0
 */

import React, { createContext, useContext, useReducer } from 'react';

/**
 * React Context para gestionar el estado del carrito de compras en toda la aplicación.
 * Este contexto proporciona datos del carrito y métodos a todos los componentes hijos.
 */
const CartContext = createContext();

/**
 * Shopping Cart State Reducer
 * 
 * This reducer manages all cart state transitions in the application.
 * It handles adding, removing, updating, and clearing cart items.
 * Products are identified by both id and productType to handle cases where
 * the same product might exist in different categories.
 * 
 * @param {Object} state - Current cart state containing items array
 * @param {Object} action - Action object with type and payload
 * @returns {Object} New cart state
 */
const cartReducer = (state, action) => {
    switch (action.type) {
        // Add a product to the cart or increment quantity if already exists
        case 'ADD_TO_CART':
            // Check if the item already exists in the cart
            // Items are matched by both id and productType for uniqueness
            const existingItem = state.items.find(item => 
                item.id === action.payload.id && item.productType === action.payload.productType
            );
            
            if (existingItem) {
                // If item exists, increment its quantity by 1
                return {
                    ...state,
                    items: state.items.map(item =>
                        item.id === action.payload.id && item.productType === action.payload.productType
                            ? { ...item, quantity: item.quantity + 1 }
                            : item
                    )
                };
            } else {
                // If item doesn't exist, add it with quantity 1
                return {
                    ...state,
                    items: [...state.items, { ...action.payload, quantity: 1 }]
                };
            }
        
        // Remove a product completely from the cart
        case 'REMOVE_FROM_CART':
            return {
                ...state,
                items: state.items.filter(item => 
                    !(item.id === action.payload.id && item.productType === action.payload.productType)
                )
            };
        
        // Update the quantity of a specific product in the cart
        case 'UPDATE_QUANTITY':
            return {
                ...state,
                items: state.items.map(item =>
                    item.id === action.payload.id && item.productType === action.payload.productType
                        ? { ...item, quantity: action.payload.quantity }
                        : item
                )
            };
        
        // Clear all items from the cart
        case 'CLEAR_CART':
            return {
                ...state,
                items: []                // Reset items array to empty
            };
        
        // Return current state for unknown actions
        default:
            return state;
    }
};

/**
 * CartProvider Component
 * 
 * This component wraps the application and provides shopping cart context
 * to all child components. It manages cart state and provides methods for
 * cart operations like adding, removing, and updating items.
 * 
 * @param {Object} props - Component properties
 * @param {React.ReactNode} props.children - Child components to wrap
 * @returns {JSX.Element} Provider component with cart context
 */
export function CartProvider({ children }) {
    // Initialize cart state with an empty items array
    const [state, dispatch] = useReducer(cartReducer, { items: [] });

    /**
     * Add Product to Cart
     * 
     * Adds a product to the cart or increments quantity if already exists.
     * The product object should contain all necessary information including
     * id, productType, precio, name, etc.
     * 
     * @param {Object} product - Product object to add to cart
     * @param {string|number} product.id - Unique product identifier
     * @param {string} product.productType - Type of product (batas, cosmetiqueros, etc.)
     * @param {number} product.precio - Product price
     * @param {string} product.name - Product name
     */
    const addToCart = (product) => {
        dispatch({ type: 'ADD_TO_CART', payload: product });
    };

    /**
     * Remove Product from Cart
     * 
     * Completely removes a product from the cart regardless of quantity.
     * 
     * @param {string|number} productId - Unique identifier of the product to remove
     * @param {string} productType - Type of the product to remove
     */
    const removeFromCart = (productId, productType) => {
        dispatch({ type: 'REMOVE_FROM_CART', payload: { id: productId, productType } });
    };

    /**
     * Update Product Quantity
     * 
     * Updates the quantity of a specific product in the cart.
     * If quantity is 0 or negative, the product is removed from the cart.
     * 
     * @param {string|number} productId - Unique identifier of the product
     * @param {number} quantity - New quantity for the product
     * @param {string} productType - Type of the product
     */
    const updateQuantity = (productId, quantity, productType) => {
        if (quantity <= 0) {
            // If quantity is 0 or negative, remove the product from cart
            removeFromCart(productId, productType);
        } else {
            // Update the product quantity
            dispatch({ type: 'UPDATE_QUANTITY', payload: { id: productId, quantity, productType } });
        }
    };

    /**
     * Clear Entire Cart
     * 
     * Removes all products from the cart, resetting it to empty state.
     * Typically used after successful checkout or when user wants to start fresh.
     */
    const clearCart = () => {
        dispatch({ type: 'CLEAR_CART' });
    };

    /**
     * Get Total Number of Items in Cart
     * 
     * Calculates and returns the total number of individual items in the cart.
     * This considers quantities, so 2 of the same product counts as 2 items.
     * 
     * @returns {number} Total number of items in cart
     */
    const getTotalItems = () => {
        return state.items.reduce((total, item) => total + item.quantity, 0);
    };

    /**
     * Get Total Price of Cart
     * 
     * Calculates and returns the total price of all items in the cart.
     * Multiplies each item's price by its quantity and sums everything.
     * 
     * @returns {number} Total price of cart contents
     */
    const getTotalPrice = () => {
        return state.items.reduce((total, item) => total + (item.precio * item.quantity), 0);
    };

    /**
     * Context value object containing all cart state and methods
     * This is what gets provided to all child components through the context
     */
    const value = {
        items: state.items,      // Array of cart items with quantities
        addToCart,               // Function to add products to cart
        removeFromCart,          // Function to remove products from cart
        updateQuantity,          // Function to update product quantities
        clearCart,               // Function to clear entire cart
        getTotalItems,           // Function to get total number of items
        getTotalPrice            // Function to get total cart price
    };

    // Provide the cart context to all child components
    return (
        <CartContext.Provider value={value}>
            {children}
        </CartContext.Provider>
    );
}

/**
 * Custom Hook for Using Cart Context
 * 
 * This hook provides a convenient way for components to access the cart
 * context. It includes error checking to ensure the hook is used within a CartProvider.
 * 
 * @returns {Object} Cart context value with state and methods
 * @throws {Error} If used outside of a CartProvider
 * 
 * @example
 * function ProductCard({ product }) {
 *     const { addToCart, items, getTotalItems } = useCart();
 *     
 *     const handleAddToCart = () => {
 *         addToCart(product);
 *     };
 *     
 *     return (
 *         <div>
 *             <h3>{product.name}</h3>
 *             <p>${product.precio}</p>
 *             <button onClick={handleAddToCart}>Add to Cart</button>
 *             <p>Cart has {getTotalItems()} items</p>
 *         </div>
 *     );
 * }
 */
export function useCart() {
    const context = useContext(CartContext);
    
    // Ensure the hook is used within a CartProvider
    if (!context) {
        throw new Error('useCart must be used within a CartProvider');
    }
    
    return context;
} 