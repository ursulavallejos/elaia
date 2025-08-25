/**
 * Navbar de Administración - ELAIA E-commerce
 * 
 * Componente de navegación específico para las páginas de administración.
 * Incluye enlaces directos a las funciones administrativas y perfil de usuario.
 * 
 * @author Equipo de Desarrollo ELAIA
 * @version 1.0.0
 */

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaUser, FaSignOutAlt, FaUserCircle, FaHome } from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';

const AdminNavbar = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [showUserMenu, setShowUserMenu] = useState(false);

  const handleLogout = () => {
    logout();
    setShowUserMenu(false);
    navigate('/');
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark px-3 shadow-sm">
      {/* Brand Logo - Links to admin dashboard */}
      <Link className="navbar-brand fw-bold text-primary" to="/admin">
        🔧 ELAIA Admin
      </Link>

      {/* Main Navigation Links - Centered in the navbar */}
      <div className="collapse navbar-collapse justify-content-center">
        <ul className="navbar-nav">
          <li className="nav-item mx-2">
            <Link className="nav-link text-light" to="/admin">Dashboard</Link>
          </li>
          <li className="nav-item mx-2">
            <Link className="nav-link text-light" to="/admin/usuarios">Usuarios</Link>
          </li>
          <li className="nav-item mx-2">
            <Link className="nav-link text-light" to="/admin/roles">Roles</Link>
          </li>
          <li className="nav-item mx-2">
            <Link className="nav-link text-light" to="/admin/productos">Productos</Link>
          </li>
          <li className="nav-item mx-2">
            <Link className="nav-link text-light" to="/admin/categorias">Categorías</Link>
          </li>
          <li className="nav-item mx-2">
            <Link className="nav-link text-light" to="/admin/pedidos">Pedidos</Link>
          </li>
        </ul>
      </div>

      {/* Right Side - User Menu and Actions */}
      <div className="d-flex align-items-center gap-3">
        {/* Home Icon - Link to public site */}
        <Link to="/" className="text-light text-decoration-none" title="Ir al sitio público">
          <FaHome size={20} />
        </Link>
        
        {/* User Menu */}
        <div className="dropdown">
          <button
            className="btn btn-link text-light text-decoration-none p-0 dropdown-toggle"
            onClick={() => setShowUserMenu(!showUserMenu)}
            style={{ border: 'none' }}
          >
            <FaUserCircle size={24} />
          </button>
          
          {showUserMenu && (
            <div className="dropdown-menu dropdown-menu-end show position-absolute" style={{ right: 0 }}>
              {/* User Information Header */}
              <div className="dropdown-header">
                <small className="text-muted">
                  {user?.nombre} {user?.apellido}
                </small>
                <div>
                  <small className="text-muted">{user?.email}</small>
                </div>
                <div>
                  <small className="badge bg-danger">{user?.rol}</small>
                </div>
              </div>
              
              <hr className="dropdown-divider" />
              
              {/* Profile Link */}
              <Link 
                to="/perfil" 
                className="dropdown-item"
                onClick={() => setShowUserMenu(false)}
              >
                <FaUser className="me-2" />
                Mi Perfil
              </Link>
              
              <hr className="dropdown-divider" />
              
              {/* Logout Button */}
              <button 
                className="dropdown-item text-danger"
                onClick={handleLogout}
              >
                <FaSignOutAlt className="me-2" />
                Cerrar Sesión
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default AdminNavbar;
