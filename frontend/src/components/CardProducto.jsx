import React from 'react';
import { useCart } from '../context/CartContext';
import { FaShoppingCart, FaPlus, FaMinus, FaEye } from 'react-icons/fa';

export default function CardProducto({ id, nombre, descripcion, precio, imagenUrl, productType, onViewDetails }) {
    const { addToCart, items, updateQuantity } = useCart();
    const cartItem = items.find(item => item.id === id && item.productType === productType);
    const quantity = cartItem ? cartItem.quantity : 0;

    const handleAddToCart = () => {
        addToCart({ id, nombre, descripcion, precio, imagenUrl, productType });
    };

    const handleIncreaseQuantity = () => {
        updateQuantity(id, quantity + 1, productType);
    };

    const handleDecreaseQuantity = () => {
        updateQuantity(id, quantity - 1, productType);
    };

    const handleViewDetails = () => {
        if (onViewDetails) {
            onViewDetails({
                id,
                nombre,
                descripcion,
                precio,
                imagenUrl,
                productType
            });
        }
    };

    // Función para truncar descripción
    const truncateDescription = (text, maxLength = 80) => {
        if (!text) return '';
        if (text.length <= maxLength) return text;
        return text.substring(0, maxLength).trim() + '...';
    };

    return (
        <div className="card shadow-sm h-100">
            <img 
                src={imagenUrl} 
                className="card-img-top" 
                alt={nombre}
                style={{ height: '200px', objectFit: 'cover', cursor: 'pointer' }}
                onClick={handleViewDetails}
            />
            <div className="card-body d-flex flex-column">
                <h5 className="card-title">{nombre}</h5>
                <p className="card-text flex-grow-1" title={descripcion}>
                    {truncateDescription(descripcion)}
                </p>
                <p className="card-text">
                    <strong className="text-primary fs-5">${precio.toLocaleString()}</strong>
                </p>
                
                {quantity === 0 ? (
                    <div className="row g-2">
                        <div className="col-8">
                            <button 
                                className="btn btn-primary w-100" 
                                onClick={handleAddToCart}
                            >
                                <FaShoppingCart className="me-2" />
                                Agregar al carrito
                            </button>
                        </div>
                        <div className="col-4">
                            <button 
                                className="btn btn-outline-secondary w-100 small" 
                                onClick={handleViewDetails}
                                title="Ver más detalles"
                            >
                                <FaEye /> Ver más
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="row g-2 align-items-center">
                        <div className="col-8">
                            <div className="d-flex align-items-center justify-content-center gap-2">
                                <button 
                                    className="btn btn-outline-secondary btn-sm" 
                                    onClick={handleDecreaseQuantity}
                                >
                                    <FaMinus />
                                </button>
                                <span className="fw-bold">{quantity}</span>
                                <button 
                                    className="btn btn-outline-secondary btn-sm" 
                                    onClick={handleIncreaseQuantity}
                                >
                                    <FaPlus />
                                </button>
                            </div>
                        </div>
                        <div className="col-4">
                            <button 
                                className="btn btn-outline-secondary w-100 small" 
                                onClick={handleViewDetails}
                                title="Ver más detalles"
                            >
                                <FaEye /> Ver más
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
