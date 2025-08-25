/**
 * Página Mis Pedidos - ELAIA E-commerce
 * 
 * Página que muestra el historial de pedidos del usuario autenticado.
 * Permite ver el estado de los pedidos y sus detalles.
 * 
 * @author Equipo de Desarrollo ELAIA
 * @version 1.0.0
 */

import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useLocation } from 'react-router-dom';
import { FaBox, FaEye, FaTruck, FaCheckCircle, FaClock, FaExclamationCircle } from 'react-icons/fa';
import { BRAND_COLORS } from '../constants/colors';
import Footer from '../components/Footer.jsx';
import { apiRequest } from '../config/api';

const MisPedidos = () => {
  const { user, isAuthenticated } = useAuth();
  const location = useLocation();
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPedido, setSelectedPedido] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  // Verificar si hay un mensaje de éxito desde la navegación
  useEffect(() => {
    if (location.state?.message) {
      setShowSuccessMessage(true);
      // Ocultar el mensaje después de 5 segundos
      setTimeout(() => {
        setShowSuccessMessage(false);
      }, 5000);
    }
  }, [location.state]);

  useEffect(() => {
    if (isAuthenticated && user) {
      fetchPedidos();
    }
  }, [isAuthenticated, user]);

  const fetchPedidos = async () => {
    try {
      setLoading(true);
      const data = await apiRequest(`/pedidos/usuario/${user.id}`);
      setPedidos(data.pedidos || []);
    } catch (error) {
      console.error('Error al conectar con el servidor:', error);
      setPedidos([]);
    } finally {
      setLoading(false);
    }
  };



  const handleViewDetails = (pedido) => {
    setSelectedPedido(pedido);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedPedido(null);
  };

  if (!isAuthenticated) {
    return (
      <div>
        <div className="container mt-5 text-center" style={{ minHeight: '60vh' }}>
          <FaBox size={64} className="text-muted mb-3" />
          <h2>Acceso Requerido</h2>
          <p className="text-muted">Debes iniciar sesión para ver tus pedidos</p>
        </div>
        <Footer />
      </div>
    );
  }

  if (loading) {
    return (
      <div>
        <div className="container mt-5 text-center" style={{ minHeight: '60vh' }}>
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Cargando pedidos...</span>
          </div>
          <p className="mt-3 text-muted">Cargando tus pedidos...</p>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div>
      <div className="container mt-4 mb-5">
        {/* Header */}
        <div className="d-flex align-items-center mb-4">
          <FaBox className="me-3" style={{ color: BRAND_COLORS.primary, fontSize: '2rem' }} />
          <div>
            <h1 className="mb-0">Mis Pedidos</h1>
            <p className="text-muted mb-0">Historial de compras y estado de envíos</p>
          </div>
        </div>

        {/* Mensaje de éxito */}
        {showSuccessMessage && location.state?.message && (
          <div className="alert alert-success alert-dismissible fade show mb-4" role="alert">
            <FaCheckCircle className="me-2" />
            {location.state.message}
            {location.state?.pedidoId && (
              <div className="mt-2">
                <small>Número de pedido: #{location.state.pedidoId}</small>
              </div>
            )}
            <button 
              type="button" 
              className="btn-close" 
              onClick={() => setShowSuccessMessage(false)}
              aria-label="Close"
            ></button>
          </div>
        )}

        {pedidos.length === 0 ? (
          <div className="text-center py-5">
            <FaBox size={64} className="text-muted mb-3" />
            <h3 className="text-muted">No tienes pedidos aún</h3>
            <p className="text-muted">Cuando realices tu primera compra, aparecerá aquí</p>
          </div>
        ) : (
          <div className="row">
            {pedidos.map(pedido => (
              <div key={pedido.id} className="col-lg-6 col-md-6 col-sm-12 mb-4">
                <div className="card shadow-sm h-100">
                  <div className="card-header d-flex justify-content-between align-items-center">
                    <div className="d-flex align-items-center">
                      <FaBox className="text-primary" />
                      <span className="ms-2 fw-bold">Pedido #{pedido.id}</span>
                    </div>
                    <span className="badge bg-success">
                      Pedido realizado
                    </span>
                  </div>
                  <div className="card-body">
                    <div className="row mb-3">
                      <div className="col-6">
                        <small className="text-muted">Fecha:</small>
                        <div className="fw-medium">
                          {new Date(pedido.fecha).toLocaleDateString('es-CL')}
                        </div>
                      </div>
                      <div className="col-6 text-end">
                        <small className="text-muted">Total:</small>
                        <div className="fw-bold text-primary">
                          ${pedido.total.toLocaleString()}
                        </div>
                      </div>
                    </div>

                    {pedido.DetallePedidos && pedido.DetallePedidos.length > 0 && (
                      <div className="mb-3">
                        <small className="text-muted">Productos:</small>
                        <div className="mt-1">
                          {pedido.DetallePedidos.slice(0, 2).map((detalle, index) => (
                            <div key={index} className="d-flex align-items-center mb-1">
                              <span className="badge bg-light text-dark me-2">{detalle.cantidad}x</span>
                              <small>{detalle.Producto?.nombre}</small>
                            </div>
                          ))}
                          {pedido.DetallePedidos.length > 2 && (
                            <small className="text-muted">
                              y {pedido.DetallePedidos.length - 2} producto(s) más...
                            </small>
                          )}
                        </div>
                      </div>
                    )}

                    <button
                      className="btn btn-outline-primary btn-sm w-100"
                      onClick={() => handleViewDetails(pedido)}
                    >
                      <FaEye className="me-2" />
                      Ver Detalles
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal de detalles del pedido */}
      {showModal && selectedPedido && (
        <div 
          className="modal fade show d-block" 
          tabIndex="-1" 
          style={{ 
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            zIndex: 1055
          }}
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              handleCloseModal();
            }
          }}
        >
          <div className="modal-dialog modal-lg modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  Pedido #{selectedPedido.id}
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={handleCloseModal}
                ></button>
              </div>
              <div className="modal-body">
                <div className="row mb-3">
                  <div className="col-md-6">
                    <strong>Fecha del pedido:</strong><br />
                    {new Date(selectedPedido.fecha).toLocaleDateString('es-CL', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </div>
                  <div className="col-md-6">
                    <strong>Estado:</strong><br />
                    <span className="badge bg-success">
                      Pedido realizado
                    </span>
                  </div>
                </div>

                <h6 className="mb-3">Productos del pedido:</h6>
                <div className="table-responsive">
                  <table className="table table-sm">
                    <thead>
                      <tr>
                        <th>Producto</th>
                        <th>Cantidad</th>
                        <th>Precio Unit.</th>
                        <th>Subtotal</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedPedido.DetallePedidos?.map((detalle, index) => (
                        <tr key={index}>
                          <td>{detalle.Producto?.nombre || 'Producto no disponible'}</td>
                          <td>{detalle.cantidad}</td>
                          <td>${detalle.precio_unitario.toLocaleString()}</td>
                          <td>${(detalle.cantidad * detalle.precio_unitario).toLocaleString()}</td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot>
                      <tr>
                        <th colSpan="3">Total:</th>
                        <th>${selectedPedido.total.toLocaleString()}</th>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={handleCloseModal}
                >
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default MisPedidos;
