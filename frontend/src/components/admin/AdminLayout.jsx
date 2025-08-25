/**
 * Layout Principal de Administración - ELAIA E-commerce
 * 
 * Componente que define la estructura base para todas las páginas de administración.
 * Incluye navegación lateral, header administrativo y área de contenido principal.
 * 
 * Características:
 * - Navegación lateral con menús colapsables
 * - Header con información del usuario y logout
 * - Breadcrumbs para navegación contextual
 * - Diseño responsivo para dispositivos móviles
 * - Protección de rutas para solo administradores
 * 
 * @author Equipo de Desarrollo ELAIA
 * @version 1.0.0
 */

import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import AdminNavbar from './AdminNavbar';

const AdminLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout, isAuthenticated, isAdmin } = useAuth();

  // Verificar autenticación y permisos de administrador
  if (!isAuthenticated || !isAdmin()) {
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-100 bg-light">
        <div className="text-center p-4 bg-white rounded shadow" style={{maxWidth: '400px'}}>
          <h2 className="text-danger mb-3">🚫 Acceso Denegado</h2>
          <p className="text-muted mb-4">No tienes permisos para acceder al panel de administración.</p>
          <button onClick={() => navigate('/')} className="btn btn-primary">
            Volver al inicio
          </button>
        </div>
      </div>
    );
  }

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  // Configuración del menú de navegación
  const menuItems = [
    {
      title: 'Dashboard',
      path: '/admin',
      icon: '📊',
    },
    {
      title: 'Usuarios',
      path: '/admin/usuarios',
      icon: '👥',
    },
    {
      title: 'Roles',
      path: '/admin/roles', 
      icon: '🔑',
    },
    {
      title: 'Productos',
      path: '/admin/productos',
      icon: '🛍️',
    },
    {
      title: 'Categorías',
      path: '/admin/categorias',
      icon: '📂',
    },
    {
      title: 'Pedidos',
      path: '/admin/pedidos',
      icon: '📋',
    },
  ];

  // Generar breadcrumbs basado en la ruta actual
  const generateBreadcrumbs = () => {
    const pathSegments = location.pathname.split('/').filter(Boolean);
    const breadcrumbs = [{ name: 'Inicio', path: '/' }];
    
    if (pathSegments.length > 0 && pathSegments[0] === 'admin') {
      breadcrumbs.push({ name: 'Administración', path: '/admin' });
      
      if (pathSegments.length > 1) {
        const section = pathSegments[1];
        const sectionName = section.charAt(0).toUpperCase() + section.slice(1);
        breadcrumbs.push({ name: sectionName, path: `/admin/${section}` });
      }
    }
    
    return breadcrumbs;
  };

  const breadcrumbs = generateBreadcrumbs();

  return (
    <div className="min-vh-100 bg-light">
      {/* Admin Navbar - Sticky */}
      <div className="position-sticky top-0" style={{ zIndex: 1060 }}>
        <AdminNavbar />
      </div>
      
      <div className="d-flex">
      {/* Sidebar - Sticky */}
      <aside 
        className={`bg-dark d-flex flex-column position-sticky ${sidebarOpen ? '' : 'd-none d-lg-flex'}`}
        style={{
          width: sidebarOpen ? '250px' : '70px',
          height: 'calc(100vh - 56px)', // Altura completa menos el navbar
          top: '56px', // Posición debajo del navbar
          zIndex: 1050,
          transition: 'width 0.3s ease'
        }}
      >
        <div className="p-3 border-bottom border-secondary">
          <div className="d-flex align-items-center">
            <span className="fs-4 me-2">👑</span>
            {sidebarOpen && <span className="text-white fw-bold">ELAIA Admin</span>}
          </div>
        </div>

        <nav className="flex-grow-1 py-2">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`d-flex align-items-center px-3 py-2 text-decoration-none text-light ${
                location.pathname === item.path ? 'bg-primary bg-opacity-25 border-end border-primary border-3' : ''
              } hover-bg-secondary`}
              style={{transition: 'all 0.2s ease'}}
              onMouseEnter={(e) => e.target.style.backgroundColor = 'rgba(255,255,255,0.1)'}
              onMouseLeave={(e) => {
                if (location.pathname !== item.path) {
                  e.target.style.backgroundColor = 'transparent';
                }
              }}
            >
              <span className="fs-5 me-2" style={{minWidth: '20px'}}>{item.icon}</span>
              {sidebarOpen && <span>{item.title}</span>}
            </Link>
          ))}
        </nav>

        <div className="border-top border-secondary p-2">
          <Link 
            to="/" 
            className="d-flex align-items-center px-3 py-2 text-decoration-none text-light"
            onMouseEnter={(e) => e.target.style.backgroundColor = 'rgba(255,255,255,0.1)'}
            onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
          >
            <span className="fs-5 me-2">🏠</span>
            {sidebarOpen && <span>Volver al sitio</span>}
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-grow-1">
        {/* Content Area */}
        <main className="p-4">
          {children}
        </main>
      </div>

      {/* Overlay para móvil */}
      {sidebarOpen && (
        <div 
          className="position-fixed w-100 bg-dark bg-opacity-50 d-lg-none"
          style={{
            top: '56px', // Debajo del navbar
            height: 'calc(100vh - 56px)',
            zIndex: 1040
          }}
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
    </div>
  );
};

export default AdminLayout;
