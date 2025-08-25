/**
 * Dashboard de Administración - ELAIA E-commerce
 * 
 * Panel principal de administración con estadísticas generales,
 * resumen de actividad y accesos rápidos a funcionalidades.
 * 
 * @author Equipo de Desarrollo ELAIA
 * @version 1.0.0
 */

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import AdminLayout from '../../components/admin/AdminLayout';
import { useUsuarios, useRoles, useProductos, useCategorias, usePedidos } from '../../hooks/useAdmin';


const Dashboard = () => {
  const { usuarios } = useUsuarios();
  const { roles } = useRoles();
  const { productos } = useProductos();
  const { categorias } = useCategorias();
  const { pedidos } = usePedidos();

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simular carga de datos
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  // Calcular estadísticas
  const stats = {
    usuarios: {
      total: usuarios.length,
      administradores: usuarios.filter(u => u.Rol?.nombre === 'Administrador').length,
      clientes: usuarios.filter(u => u.Rol?.nombre === 'Cliente').length,
    },
    productos: {
      total: productos.length,
      conImagen: productos.filter(p => p.imagen_url).length,
      sinImagen: productos.filter(p => !p.imagen_url).length,
    },
    categorias: {
      total: categorias.length,
      conProductos: categorias.filter(c => c.Productos?.length > 0).length,
      vacias: categorias.filter(c => (c.Productos?.length || 0) === 0).length,
    },
    pedidos: {
      total: pedidos.length,
      hoy: pedidos.filter(p => {
        const hoy = new Date();
        const fechaPedido = new Date(p.createdAt);
        return fechaPedido.toDateString() === hoy.toDateString();
      }).length,
      esteMes: pedidos.filter(p => {
        const hoy = new Date();
        const fechaPedido = new Date(p.createdAt);
        return fechaPedido.getMonth() === hoy.getMonth() && fechaPedido.getFullYear() === hoy.getFullYear();
      }).length,
    },
  };

  // Accesos rápidos
  const quickActions = [
    {
      title: 'Nuevo Usuario',
      description: 'Crear una cuenta de usuario',
      icon: '👤',
      link: '/admin/usuarios',
      color: 'blue',
    },
    {
      title: 'Nuevo Producto',
      description: 'Añadir producto al catálogo',
      icon: '🛍️',
      link: '/admin/productos',
      color: 'green',
    },
    {
      title: 'Nueva Categoría',
      description: 'Organizar productos',
      icon: '📂',
      link: '/admin/categorias',
      color: 'purple',
    },
    {
      title: 'Gestionar Roles',
      description: 'Configurar permisos',
      icon: '🔑',
      link: '/admin/roles',
      color: 'orange',
    },
  ];

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="d-flex justify-content-center align-items-center min-vh-100">
          <div className="text-center">
            <div className="spinner-border text-primary mb-3" role="status">
              <span className="visually-hidden">Cargando...</span>
            </div>
            <p className="text-muted">Cargando dashboard...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="container-fluid">
        {/* Header */}
        <div className="mb-4">
          <h1 className="h2 mb-2">📊 Dashboard de Administración</h1>
          <p className="text-muted mb-0">Resumen general del sistema ELAIA E-commerce</p>
        </div>

        {/* Bienvenida */}
        <div className="card mb-4">
          <div className="card-body">
            <div className="row align-items-center">
              <div className="col-md-8">
                <h2 className="card-title mb-3">¡Bienvenido al Panel de Administración! 👋</h2>
                <p className="card-text text-muted mb-0">
                  Aquí puedes gestionar todos los aspectos de tu e-commerce ELAIA.
                  Encuentra estadísticas importantes y accesos rápidos a las funcionalidades principales.
                </p>
              </div>
              <div className="col-md-4 text-md-end mt-3 mt-md-0">
                <Link to="/admin/productos" className="btn btn-primary me-2 mb-2">
                  🛍️ Gestionar Productos
                </Link>
                <Link to="/admin/usuarios" className="btn btn-secondary mb-2">
                  👥 Ver Usuarios
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Estadísticas Principales */}
        <div className="mb-5">
          <h3 className="mb-4">📈 Estadísticas Generales</h3>
          <div className="row g-4">
            {/* Usuarios */}
            <div className="col-lg-3 col-md-6">
              <div className="card bg-primary text-white h-100">
                <div className="card-body">
                  <div className="d-flex justify-content-between align-items-start mb-3">
                    <h5 className="card-title mb-0">Usuarios</h5>
                    <span className="fs-2">👥</span>
                  </div>
                  <h3 className="mb-3">{stats.usuarios.total}</h3>
                  <div className="mb-3">
                    <small className="d-block">👑 {stats.usuarios.administradores} Admin</small>
                    <small className="d-block">👤 {stats.usuarios.clientes} Clientes</small>
                  </div>
                  <Link to="/admin/usuarios" className="btn btn-light btn-sm">
                    Ver todos →
                  </Link>
                </div>
              </div>
            </div>

            {/* Productos */}
            <div className="col-lg-3 col-md-6">
              <div className="card bg-success text-white h-100">
                <div className="card-body">
                  <div className="d-flex justify-content-between align-items-start mb-3">
                    <h5 className="card-title mb-0">Productos</h5>
                    <span className="fs-2">🛍️</span>
                  </div>
                  <h3 className="mb-3">{stats.productos.total}</h3>
                  <div className="mb-3">
                    <small className="d-block">📷 {stats.productos.conImagen} Con imagen</small>
                    {stats.productos.sinImagen > 0 && (
                      <small className="d-block text-warning">🖼️ {stats.productos.sinImagen} Sin imagen</small>
                    )}
                  </div>
                  <Link to="/admin/productos" className="btn btn-light btn-sm">
                    Gestionar →
                  </Link>
                </div>
              </div>
            </div>

            {/* Categorías */}
            <div className="col-lg-3 col-md-6">
              <div className="card bg-warning text-dark h-100">
                <div className="card-body">
                  <div className="d-flex justify-content-between align-items-start mb-3">
                    <h5 className="card-title mb-0">Categorías</h5>
                    <span className="fs-2">📂</span>
                  </div>
                  <h3 className="mb-3">{stats.categorias.total}</h3>
                  <div className="mb-3">
                    <small className="d-block">📦 {stats.categorias.conProductos} Con productos</small>
                    {stats.categorias.vacias > 0 && (
                      <small className="d-block text-dark">📭 {stats.categorias.vacias} Vacías</small>
                    )}
                  </div>
                  <Link to="/admin/categorias" className="btn btn-dark btn-sm">
                    Organizar →
                  </Link>
                </div>
              </div>
            </div>

            {/* Pedidos */}
            <div className="col-lg-3 col-md-6">
              <div className="card bg-danger text-white h-100">
                <div className="card-body">
                  <div className="d-flex justify-content-between align-items-start mb-3">
                    <h5 className="card-title mb-0">Pedidos</h5>
                    <span className="fs-2">📋</span>
                  </div>
                  <h3 className="mb-3">{stats.pedidos.total}</h3>
                  <div className="mb-3">
                    <small className="d-block">📅 {stats.pedidos.hoy} Hoy</small>
                    <small className="d-block">📊 {stats.pedidos.esteMes} Este mes</small>
                  </div>
                  <Link to="/admin/pedidos" className="btn btn-light btn-sm">
                    Revisar →
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Accesos Rápidos */}
        <div className="mb-5">
          <h3 className="mb-4">⚡ Accesos Rápidos</h3>
          <div className="row g-3">
            {quickActions.map((action, index) => (
              <div key={index} className="col-lg-3 col-md-6">
                <Link
                  to={action.link}
                  className={`card h-100 text-decoration-none border-0 shadow-sm ${
                    action.color === 'blue' ? 'border-primary' :
                    action.color === 'green' ? 'border-success' :
                    action.color === 'purple' ? 'border-info' :
                    action.color === 'orange' ? 'border-warning' :
                    'border-secondary'
                  }`}
                >
                  <div className="card-body d-flex align-items-center">
                    <div className="me-3 fs-1">{action.icon}</div>
                    <div className="flex-grow-1">
                      <h5 className="card-title mb-1 text-dark">{action.title}</h5>
                      <p className="card-text text-muted small mb-0">{action.description}</p>
                    </div>
                    <div className="text-muted">→</div>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </div>

        {/* Estado del Sistema */}
        <div className="mb-5">
          <h3 className="mb-4">⚙️ Estado del Sistema</h3>
          <div className="card">
            <div className="card-body">
              <div className="row g-3">
                <div className="col-md-4">
                  <div className="d-flex align-items-center">
                    <span className="badge bg-success rounded-circle me-3" style={{width: '12px', height: '12px'}}></span>
                    <div>
                      <div className="fw-medium">API Backend</div>
                      <small className="text-muted">Funcionando correctamente</small>
                    </div>
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="d-flex align-items-center">
                    <span className="badge bg-success rounded-circle me-3" style={{width: '12px', height: '12px'}}></span>
                    <div>
                      <div className="fw-medium">Base de Datos</div>
                      <small className="text-muted">Conexión estable</small>
                    </div>
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="d-flex align-items-center">
                    <span className="badge bg-success rounded-circle me-3" style={{width: '12px', height: '12px'}}></span>
                    <div>
                      <div className="fw-medium">Autenticación</div>
                      <small className="text-muted">JWT activo</small>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Enlaces Útiles */}
        <div className="mb-5">
          <h3 className="mb-4">🔗 Enlaces Útiles</h3>
          <div className="row g-3">
            <div className="col-md-4">
              <a href="/" target="_blank" rel="noopener noreferrer" className="card h-100 text-decoration-none">
                <div className="card-body d-flex align-items-center">
                  <span className="me-3 fs-3">🏠</span>
                  <div>
                    <div className="fw-medium text-dark">Sitio Web Principal</div>
                    <small className="text-muted">Ver el sitio público</small>
                  </div>
                </div>
              </a>
            </div>
            <div className="col-md-4">
              <a href="/admin/usuarios" className="card h-100 text-decoration-none">
                <div className="card-body d-flex align-items-center">
                  <span className="me-3 fs-3">👥</span>
                  <div>
                    <div className="fw-medium text-dark">Gestión de Usuarios</div>
                    <small className="text-muted">Administrar cuentas y roles</small>
                  </div>
                </div>
              </a>
            </div>
            <div className="col-md-4">
              <a href="/admin/productos" className="card h-100 text-decoration-none">
                <div className="card-body d-flex align-items-center">
                  <span className="me-3 fs-3">🛍️</span>
                  <div>
                    <div className="fw-medium text-dark">Catálogo de Productos</div>
                    <small className="text-muted">Actualizar inventario</small>
                  </div>
                </div>
              </a>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default Dashboard;
