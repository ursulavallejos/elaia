/**
 * Componente de Barra de Navegación para ELAIA E-commerce
 * 
 * Este componente proporciona la interfaz principal de navegación para la aplicación.
 * Incluye enlaces de categorías de productos, controles de autenticación de usuario, acceso al carrito
 * de compras y funcionalidad de búsqueda.
 * 
 * Características Principales:
 * - Layout responsivo de navbar Bootstrap
 * - Estado dinámico de autenticación de usuario (logueado/no logueado)
 * - Ícono de carrito de compras con badge de conteo de ítems
 * - Menú dropdown de usuario con acceso a perfil y logout
 * - Logo de marca enlazando a página principal
 * - Enlaces de navegación de categorías de productos
 * - Ícono de acceso rápido al carrito
 * - Menú de administración para usuarios con rol de administrador
 * 
 * Gestión de Estado:
 * - Usa AuthContext para estado de autenticación de usuario
 * - Usa CartContext para conteo de ítems del carrito
 * - Estado local para visibilidad del menú dropdown
 * 
 * @author Equipo de Desarrollo ELAIA
 * @version 1.0.0
 */

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaUser, FaShoppingBag, FaSignOutAlt, FaUserCircle } from 'react-icons/fa';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

/**
 * Componente Navbar
 * 
 * Componente principal de navegación que proporciona acceso a todas las secciones principales de la aplicación.
 * Se adapta dinámicamente basado en el estado de autenticación del usuario y contenidos del carrito de compras.
 * 
 * @returns {JSX.Element} Barra de navegación renderizada
 */
export default function Navbar() {
    // Hook de navegación para redirecciones
    const navigate = useNavigate();
    
    // Obtener información del carrito desde CartContext
    const { getTotalItems } = useCart();
    
    // Obtener información de autenticación desde AuthContext
    const { isAuthenticated, user, logout, isAdmin } = useAuth();
    
    // Estado local para controlar la visibilidad del menú dropdown del usuario
    const [showUserMenu, setShowUserMenu] = useState(false);

    return (
        <nav className="navbar navbar-expand-lg navbar-light bg-light px-3 shadow-sm">
            {/* Brand Logo - Links to home page */}
            <Link className="navbar-brand" to="/">
                <img 
                    src="/logo-elaia.png" 
                    alt="ELAIA"
                    height="40"
                    className="d-inline-block align-top"
                />
            </Link>

            {/* Main Navigation Links - Centered in the navbar */}
            <div className="collapse navbar-collapse justify-content-center">
                <ul className="navbar-nav">
                    {/* Product Category Links */}
                    <li className="nav-item mx-2">
                        <Link className="nav-link" to="/batas">Batas</Link>
                    </li>
                    <li className="nav-item mx-2">
                        <Link className="nav-link" to="/cosmetiqueros">Cosmetiqueros</Link>
                    </li>
                    <li className="nav-item mx-2">
                        <Link className="nav-link" to="/sobre-elaia">Sobre Elaia</Link>
                    </li>
                    {/* Admin Menu - Solo visible para administradores autenticados */}
                    {isAuthenticated && isAdmin() && (
                        <li className="nav-item mx-2">
                            <Link className="nav-link text-primary fw-medium" to="/admin">
                                🔧 Admin
                            </Link>
                        </li>
                    )}
                </ul>
            </div>

            {/* Right Side Action Icons and User Menu */}
            <div className="d-flex align-items-center gap-3">
                {/* Shopping Cart Icon with Item Count Badge */}
                <Link to="/carrito" className="text-dark text-decoration-none position-relative">
                    <FaShoppingBag size={20} />
                    {/* Display item count badge only if cart has items */}
                    {getTotalItems() > 0 && (
                        <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                            {getTotalItems()}
                        </span>
                    )}
                </Link>
                
                {/* User Authentication Section - Shows different content based on login status */}
                {isAuthenticated ? (
                    /* Authenticated User Dropdown Menu */
                    <div className="dropdown">
                        {/* User Avatar Button - Toggles dropdown menu */}
                        <button
                            className="btn btn-link text-dark text-decoration-none p-0 dropdown-toggle"
                            onClick={() => setShowUserMenu(!showUserMenu)}
                            style={{ border: 'none' }}
                        >
                            <FaUserCircle size={24} />
                        </button>
                        
                        {/* Dropdown Menu - Shown when showUserMenu is true */}
                        {showUserMenu && (
                            <div className="dropdown-menu dropdown-menu-end show position-absolute" style={{ right: 0 }}>
                                {/* User Information Header */}
                                <div className="dropdown-header">
                                    <small className="text-muted">Hola, {user?.email}</small>
                                    {user?.rol && <div><small className="text-muted">Rol: {user.rol}</small></div>}
                                </div>
                                
                                {/* Profile Link */}
                                <Link 
                                    to="/perfil" 
                                    className="dropdown-item"
                                    onClick={() => setShowUserMenu(false)}
                                >
                                    <FaUser className="me-2" />
                                    Mi Perfil
                                </Link>
                                
                                {/* Mis Pedidos Link */}
                                <Link 
                                    to="/mis-pedidos" 
                                    className="dropdown-item"
                                    onClick={() => setShowUserMenu(false)}
                                >
                                    📦 Mis Pedidos
                                </Link>
                                
                                <hr className="dropdown-divider" />
                                
                                {/* Logout Button */}
                                <button 
                                    className="dropdown-item text-danger"
                                    onClick={() => {
                                        logout();
                                        setShowUserMenu(false);
                                        navigate('/'); // Redirigir al home después del logout
                                    }}
                                >
                                    <FaSignOutAlt className="me-2" />
                                    Cerrar Sesión
                                </button>
                            </div>
                        )}
                    </div>
                ) : (
                    /* Not Authenticated - Show Login Link */
                    <Link to="/login" className="text-dark text-decoration-none">
                        <FaUser size={20} />
                    </Link>
                )}
            </div>
        </nav>
    );
}

