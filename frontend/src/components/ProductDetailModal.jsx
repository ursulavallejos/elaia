/**
 * Modal de Detalles de Producto - ELAIA E-commerce
 * 
 * Componente modal que muestra información detallada de un producto
 * con un diseño profesional tipo e-commerce.
 * 
 * @author Equipo de Desarrollo ELAIA
 * @version 1.0.0
 */

import React from 'react';
import { FaTimes, FaShoppingCart, FaPlus, FaMinus, FaEye } from 'react-icons/fa';
import { useCart } from '../context/CartContext';
import { BRAND_COLORS } from '../constants/colors';

const ProductDetailModal = ({ product, isOpen, onClose }) => {
  const { addToCart, items, updateQuantity } = useCart();
  
  if (!isOpen || !product) return null;

  const cartItem = items.find(item => item.id === product.id && item.productType === product.productType);
  const quantity = cartItem ? cartItem.quantity : 0;

  const handleAddToCart = () => {
    addToCart({
      id: product.id,
      nombre: product.nombre,
      descripcion: product.descripcion,
      precio: product.precio,
      imagenUrl: product.imagenUrl || product.imagen_url,
      productType: product.productType
    });
  };

  const handleIncreaseQuantity = () => {
    updateQuantity(product.id, quantity + 1, product.productType);
  };

  const handleDecreaseQuantity = () => {
    updateQuantity(product.id, quantity - 1, product.productType);
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div 
      className="modal fade show d-block" 
      tabIndex="-1" 
      style={{ 
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        zIndex: 1055
      }}
      onClick={handleBackdropClick}
    >
      <div className="modal-dialog modal-xl modal-dialog-centered">
        <div className="modal-content border-0 shadow-lg">
          {/* Header */}
          <div className="modal-header border-0 pb-0">
            <button
              type="button"
              className="btn-close"
              onClick={onClose}
              aria-label="Cerrar"
            ></button>
          </div>

          {/* Body */}
          <div className="modal-body p-0">
            <div className="row g-0">
              {/* Imagen del producto */}
              <div className="col-lg-6">
                <div className="position-relative p-3">
                  <img
                    src={product.imagenUrl || product.imagen_url}
                    alt={product.nombre}
                    className="img-fluid w-100 rounded"
                    style={{ 
                      height: '600px', 
                      objectFit: 'cover'
                    }}
                  />
                </div>
              </div>

              {/* Información del producto */}
              <div className="col-lg-6">
                <div className="p-4 p-lg-5">
                  {/* Tipo de producto */}
                  <div className="mb-3">
                    <span 
                      className="badge rounded-pill px-3 py-2"
                      style={{ 
                        backgroundColor: BRAND_COLORS.light,
                        color: BRAND_COLORS.primary,
                        fontSize: '0.875rem'
                      }}
                    >
                      {product.productType === 'batas' ? 'Bata' : 'Cosmetiquero'}
                    </span>
                  </div>

                  {/* Nombre del producto */}
                  <h2 className="fw-bold mb-3" style={{ color: BRAND_COLORS.dark }}>
                    {product.nombre}
                  </h2>

                  {/* Precio */}
                  <div className="mb-4">
                    <h3 className="fw-bold mb-0" style={{ color: BRAND_COLORS.primary }}>
                      ${product.precio.toLocaleString()}
                    </h3>
                    <small className="text-muted">Precio incluye IVA</small>
                  </div>

                  {/* Descripción */}
                  <div className="mb-4">
                    <h6 className="fw-bold mb-2" style={{ color: BRAND_COLORS.dark }}>
                      Descripción
                    </h6>
                    <p className="text-muted mb-0" style={{ lineHeight: '1.6' }}>
                      {product.descripcion}
                    </p>
                  </div>

                  {/* Características */}
                  <div className="mb-4">
                    <h6 className="fw-bold mb-3" style={{ color: BRAND_COLORS.dark }}>
                      Características
                    </h6>
                    <div className="row g-3">
                      <div className="col-6">
                        <div className="d-flex align-items-center">
                          <div 
                            className="rounded-circle me-2"
                            style={{ 
                              width: '8px', 
                              height: '8px', 
                              backgroundColor: BRAND_COLORS.secondary 
                            }}
                          ></div>
                          <small className="text-muted">Diseño único</small>
                        </div>
                      </div>
                      <div className="col-6">
                        <div className="d-flex align-items-center">
                          <div 
                            className="rounded-circle me-2"
                            style={{ 
                              width: '8px', 
                              height: '8px', 
                              backgroundColor: BRAND_COLORS.secondary 
                            }}
                          ></div>
                          <small className="text-muted">Alta calidad</small>
                        </div>
                      </div>
                      <div className="col-6">
                        <div className="d-flex align-items-center">
                          <div 
                            className="rounded-circle me-2"
                            style={{ 
                              width: '8px', 
                              height: '8px', 
                              backgroundColor: BRAND_COLORS.secondary 
                            }}
                          ></div>
                          <small className="text-muted">Materiales premium</small>
                        </div>
                      </div>
                      <div className="col-6">
                        <div className="d-flex align-items-center">
                          <div 
                            className="rounded-circle me-2"
                            style={{ 
                              width: '8px', 
                              height: '8px', 
                              backgroundColor: BRAND_COLORS.secondary 
                            }}
                          ></div>
                          <small className="text-muted">Envío incluido</small>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Información de envío */}
                  <div className="alert alert-light border mb-4">
                    <div className="d-flex align-items-start">
                      <div 
                        className="rounded-circle me-3 d-flex align-items-center justify-content-center"
                        style={{ 
                          width: '32px', 
                          height: '32px', 
                          backgroundColor: BRAND_COLORS.primary,
                          color: 'white',
                          fontSize: '14px'
                        }}
                      >
                        🚚
                      </div>
                      <div>
                        <div className="fw-bold small mb-1">Envío gratuito</div>
                        <div className="text-muted small">
                          Recíbelo en 2-3 días hábiles en todo Chile
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Controles de cantidad y compra */}
                  <div className="d-grid gap-3">
                    {quantity === 0 ? (
                      <button
                        className="btn btn-lg text-white fw-bold w-100"
                        style={{ backgroundColor: BRAND_COLORS.primary }}
                        onClick={handleAddToCart}
                      >
                        <FaShoppingCart className="me-2" />
                        Agregar al carrito
                      </button>
                    ) : (
                      <div className="row g-2 align-items-center">
                        <div className="col-auto">
                          <div className="d-flex align-items-center border rounded-pill">
                            <button
                              className="btn btn-sm"
                              onClick={handleDecreaseQuantity}
                              style={{ 
                                border: 'none',
                                color: BRAND_COLORS.primary
                              }}
                            >
                              <FaMinus size={12} />
                            </button>
                            <span 
                              className="px-3 fw-bold"
                              style={{ 
                                minWidth: '50px', 
                                textAlign: 'center',
                                color: BRAND_COLORS.dark
                              }}
                            >
                              {quantity}
                            </span>
                            <button
                              className="btn btn-sm"
                              onClick={handleIncreaseQuantity}
                              style={{ 
                                border: 'none',
                                color: BRAND_COLORS.primary
                              }}
                            >
                              <FaPlus size={12} />
                            </button>
                          </div>
                        </div>
                        <div className="col">
                          <div className="text-center">
                            <div className="fw-bold" style={{ color: BRAND_COLORS.primary }}>
                              En tu carrito
                            </div>
                            <small className="text-muted">
                              Total: ${(product.precio * quantity).toLocaleString()}
                            </small>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailModal;
