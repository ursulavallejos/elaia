/**
 * Componente de Ruta Protegida - ELAIA E-commerce
 * 
 * Componente que protege rutas específicas verificando autenticación
 * y permisos de usuario. Redirige a login si no está autenticado
 * o muestra error si no tiene permisos suficientes.
 * 
 * @author Equipo de Desarrollo ELAIA
 * @version 1.0.0
 */

import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ 
  children, 
  requireAdmin = false, 
  redirectTo = '/login' 
}) => {
  const { user, loading, isAdmin } = useAuth();
  const location = useLocation();

  // Mostrar loading mientras se verifica la autenticación
  if (loading) {
    return (
      <div className="protected-route-loading">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Verificando permisos...</p>
        </div>
      </div>
    );
  }

  // Si no está autenticado, redirigir a login
  if (!user) {
    return <Navigate to={redirectTo} state={{ from: location }} replace />;
  }

  // Si requiere admin y no es admin, mostrar acceso denegado
  if (requireAdmin && !isAdmin()) {
    return (
      <div className="access-denied-container">
        <div className="access-denied-content">
          <h2>🚫 Acceso Denegado</h2>
          <p>No tienes permisos para acceder a esta página.</p>
          <p>Se requieren permisos de administrador.</p>
          <div className="access-denied-actions">
            <button 
              onClick={() => window.history.back()} 
              className="btn btn-secondary"
            >
              ← Volver
            </button>
            <Navigate to="/" className="btn btn-primary">
              🏠 Ir al inicio
            </Navigate>
          </div>
        </div>
      </div>
    );
  }

  // Si todo está bien, renderizar el componente hijo
  return children;
};

export default ProtectedRoute;
