import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { FaTrash, FaPlus, FaMinus, FaShoppingBag, FaSpinner } from 'react-icons/fa';
import Footer from '../components/Footer.jsx';
import { apiRequest } from '../config/api';

export default function Carrito() {
    const { items, removeFromCart, updateQuantity, clearCart, getTotalPrice } = useCart();
    const { isAuthenticated, user } = useAuth();
    const navigate = useNavigate();
    const [isCreatingOrder, setIsCreatingOrder] = useState(false);
    const [orderError, setOrderError] = useState(null);

    const handleProcederAlPago = async () => {
        if (!isAuthenticated) {
            // Redirigir al login si no está autenticado
            navigate('/login');
            return;
        }

        setIsCreatingOrder(true);
        setOrderError(null);

        try {
            // Preparar productos para el pedido
            const productos = items.map(item => ({
                id: item.id,
                cantidad: item.quantity,
                precio_unitario: item.precio
            }));

            const data = await apiRequest('/pedidos', {
                method: 'POST',
                body: JSON.stringify({
                    productos
                })
            });

            console.log('Pedido creado exitosamente:', data);
            
            // Limpiar carrito
            clearCart();
            
            // Redirigir a mis pedidos con mensaje de éxito
            navigate('/mis-pedidos', { 
                state: { 
                    message: '¡Pedido creado exitosamente! Tu pedido ha sido registrado.',
                    pedidoId: data.pedido.id 
                } 
            });
        } catch (error) {
            console.error('Error al crear pedido:', error);
            setOrderError(error.message || 'Error de conexión. Por favor, intenta nuevamente.');
        } finally {
            setIsCreatingOrder(false);
        }
    };

    if (items.length === 0) {
        return (
            <div>
                <div className="container mt-5 text-center" style={{ minHeight: '60vh' }}>
                    <FaShoppingBag size={64} className="text-muted mb-3" />
                    <h2>Tu carrito está vacío</h2>
                    <p className="text-muted">Agrega algunos productos para comenzar a comprar</p>
                </div>
                <Footer />
            </div>
        );
    }

    return (
        <div>
            <div className="container mt-4 mb-5">
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <h1>Carrito de Compras</h1>
                    <button 
                        className="btn btn-outline-danger" 
                        onClick={clearCart}
                    >
                        <FaTrash className="me-2" />
                        Vaciar carrito
                    </button>
                </div>

                <div className="row">
                    <div className="col-lg-8">
                        {items.map(item => (
                            <div key={`${item.productType}-${item.id}`} className="card mb-3 shadow-sm">
                                <div className="row g-0">
                                    <div className="col-md-3">
                                        <img 
                                            src={item.imagenUrl} 
                                            className="img-fluid rounded-start h-100" 
                                            alt={item.nombre}
                                            style={{ objectFit: 'cover' }}
                                        />
                                    </div>
                                    <div className="col-md-9">
                                        <div className="card-body">
                                            <div className="d-flex justify-content-between align-items-start">
                                                <div>
                                                    <h5 className="card-title">{item.nombre}</h5>
                                                    <p className="card-text text-muted">{item.descripcion}</p>
                                                    <div className="d-flex gap-2 align-items-center">
                                                        <span className="badge bg-secondary text-capitalize">
                                                            {item.productType === 'batas' ? 'Bata' : 'Cosmetiquero'}
                                                        </span>
                                                    </div>
                                                </div>
                                                <button 
                                                    className="btn btn-outline-danger btn-sm"
                                                    onClick={() => removeFromCart(item.id, item.productType)}
                                                >
                                                    <FaTrash />
                                                </button>
                                            </div>
                                            
                                            <div className="d-flex justify-content-between align-items-center mt-3">
                                                <div className="d-flex align-items-center gap-2">
                                                    <button 
                                                        className="btn btn-outline-secondary btn-sm"
                                                        onClick={() => updateQuantity(item.id, item.quantity - 1, item.productType)}
                                                    >
                                                        <FaMinus />
                                                    </button>
                                                    <span className="fw-bold fs-5">{item.quantity}</span>
                                                    <button 
                                                        className="btn btn-outline-secondary btn-sm"
                                                        onClick={() => updateQuantity(item.id, item.quantity + 1, item.productType)}
                                                    >
                                                        <FaPlus />
                                                    </button>
                                                </div>
                                                <div className="text-end">
                                                    <p className="mb-0 text-muted">Precio unitario: ${item.precio.toLocaleString()}</p>
                                                    <h5 className="text-primary mb-0">
                                                        ${(item.precio * item.quantity).toLocaleString()}
                                                    </h5>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="col-lg-4">
                        <div className="card shadow">
                            <div className="card-header">
                                <h5 className="mb-0">Resumen del pedido</h5>
                            </div>
                            <div className="card-body">
                                <div className="d-flex justify-content-between mb-2">
                                    <span>Subtotal ({items.reduce((total, item) => total + item.quantity, 0)} productos):</span>
                                    <span>${getTotalPrice().toLocaleString()}</span>
                                </div>
                                <hr />
                                <div className="d-flex justify-content-between mb-3">
                                    <strong>Total:</strong>
                                    <strong className="text-primary fs-5">${getTotalPrice().toLocaleString()}</strong>
                                </div>
                                
                                {orderError && (
                                    <div className="alert alert-danger alert-sm mb-3">
                                        {orderError}
                                    </div>
                                )}
                                
                                <button 
                                    className="btn btn-primary w-100"
                                    onClick={handleProcederAlPago}
                                    disabled={isCreatingOrder}
                                >
                                    {isCreatingOrder ? (
                                        <>
                                            <FaSpinner className="fa-spin me-2" />
                                            Creando pedido...
                                        </>
                                    ) : (
                                        isAuthenticated ? 'Proceder al pago' : 'Iniciar sesión para comprar'
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            <Footer />
        </div>
    );
}