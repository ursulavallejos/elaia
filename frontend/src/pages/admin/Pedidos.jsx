/**
 * Página de Administración de Pedidos - ELAIA E-commerce
 * 
 * Interfaz para la gestión de pedidos del sistema.
 * Permite ver, actualizar estado y gestionar pedidos de clientes.
 * 
 * @author Equipo de Desarrollo ELAIA
 * @version 1.0.0
 */

import React, { useState, useEffect } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import DataTable from '../../components/admin/DataTable';
import { FormModal, ConfirmModal } from '../../components/admin/Modal';
import { usePedidos } from '../../hooks/useAdmin';

const Pedidos = () => {
  const {
    pedidos,
    loading,
    error,
    success,
    updateEstado,
    remove,
    clearMessages,
  } = usePedidos();

  // Estados de confirmación
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [pedidoToDelete, setPedidoToDelete] = useState(null);

  // Configuración de columnas para la tabla
  const columns = [
    {
      key: 'id',
      title: 'ID',
      width: '80px',
      sortable: true,
    },
    {
      key: 'Usuario',
      title: 'Cliente',
      sortable: true,
      render: (value, row) => (
        <div>
          <div className="fw-medium">{row.Usuario?.nombre} {row.Usuario?.apellido}</div>
          <small className="text-muted">{row.Usuario?.email}</small>
        </div>
      ),
    },
    {
      key: 'total',
      title: 'Total',
      type: 'currency',
      sortable: true,
    },

    {
      key: 'createdAt',
      title: 'Fecha de Pedido',
      type: 'date',
      sortable: true,
    },
    {
      key: 'DetallePedidos',
      title: 'Productos',
      render: (value, row) => (
        <div>
          <small className="text-muted">
            {row.DetallePedidos?.length || 0} producto(s)
          </small>
          {row.DetallePedidos && row.DetallePedidos.length > 0 && (
            <div style={{maxHeight: '60px', overflow: 'hidden'}}>
              {row.DetallePedidos.slice(0, 2).map((detalle, index) => (
                <div key={index} style={{fontSize: '0.75rem'}}>
                  {detalle.Producto?.nombre} (x{detalle.cantidad})
                </div>
              ))}
              {row.DetallePedidos.length > 2 && (
                <small className="text-muted">+{row.DetallePedidos.length - 2} más...</small>
              )}
            </div>
          )}
        </div>
      ),
    },
  ];

  // Acciones de la tabla
  const actions = [
    // Opción de eliminar deshabilitada por ahora
    // {
    //   icon: '🗑️',
    //   title: 'Eliminar pedido',
    //   variant: 'danger',
    //   onClick: handleDeleteClick,
    // },
  ];

  // Limpiar mensajes cuando se monta el componente
  useEffect(() => {
    clearMessages();
  }, [clearMessages]);



  // Manejar clic en eliminar
  function handleDeleteClick(pedido) {
    setPedidoToDelete(pedido);
    setShowDeleteConfirm(true);
  }



  // Confirmar eliminación
  const handleConfirmDelete = async () => {
    if (pedidoToDelete) {
      const success = await remove(pedidoToDelete.id);
      if (success) {
        setShowDeleteConfirm(false);
        setPedidoToDelete(null);
      }
    }
  };

  // Cancelar eliminación
  const handleCancelDelete = () => {
    setShowDeleteConfirm(false);
    setPedidoToDelete(null);
  };

  // Calcular estadísticas
  const stats = {
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
  };

  return (
    <AdminLayout>
      <div className="container-fluid">
        {/* Header */}
        <div className="d-flex justify-content-between align-items-start mb-4">
          <div>
            <h1 className="h2 mb-2">📋 Gestión de Pedidos</h1>
            <p className="text-muted mb-0">Administra los pedidos de clientes y su estado</p>
          </div>
        </div>

        {/* Mensajes de estado */}
        {error && (
          <div className="alert alert-danger alert-dismissible fade show">
            <span>⚠️ {error}</span>
            <button
              type="button"
              className="btn-close"
              onClick={clearMessages}
              aria-label="Close"
            ></button>
          </div>
        )}

        {success && (
          <div className="alert alert-success alert-dismissible fade show">
            <span>✅ {success}</span>
            <button
              type="button"
              className="btn-close"
              onClick={clearMessages}
              aria-label="Close"
            ></button>
          </div>
        )}

        {/* Estadísticas rápidas */}
        <div className="row g-3 mb-4">
          <div className="col-md-4">
            <div className="card bg-primary text-white">
              <div className="card-body text-center">
                <h5 className="card-title mb-1">Total Pedidos</h5>
                <h3 className="mb-0">{stats.total}</h3>
                <small>Todos los pedidos</small>
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card bg-success text-white">
              <div className="card-body text-center">
                <h6 className="card-title mb-1">Pedidos Hoy</h6>
                <h4 className="mb-0">{stats.hoy}</h4>
                <small>En las últimas 24 horas</small>
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card bg-info text-white">
              <div className="card-body text-center">
                <h6 className="card-title mb-1">Este Mes</h6>
                <h4 className="mb-0">{stats.esteMes}</h4>
                <small>Pedidos del mes actual</small>
              </div>
            </div>
          </div>
        </div>

        {/* Tabla de pedidos */}
        <DataTable
          data={pedidos}
          columns={columns}
          actions={actions}
          loading={loading}
          error={error}
          emptyMessage="No hay pedidos registrados"
        />



        {/* Modal de confirmación de eliminación */}
        <ConfirmModal
          isOpen={showDeleteConfirm}
          onClose={handleCancelDelete}
          onConfirm={handleConfirmDelete}
          title="Eliminar Pedido"
          message={`¿Estás seguro de que deseas eliminar el pedido #${pedidoToDelete?.id}? Esta acción no se puede deshacer.`}
          confirmText="Eliminar"
          variant="danger"
          loading={loading}
        />
      </div>
    </AdminLayout>
  );
};

export default Pedidos;
