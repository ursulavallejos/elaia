/**
 * Página de Administración de Roles - ELAIA E-commerce
 * 
 * Interfaz para la gestión de roles del sistema.
 * Permite crear, editar y eliminar roles de usuario.
 * 
 * @author Equipo de Desarrollo ELAIA
 * @version 1.0.0
 */

import React, { useState, useEffect } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import DataTable from '../../components/admin/DataTable';
import { FormModal, ConfirmModal } from '../../components/admin/Modal';
import { useRoles } from '../../hooks/useAdmin';


const Roles = () => {
  const {
    roles,
    loading,
    error,
    success,
    create,
    update,
    remove,
    clearMessages,
  } = useRoles();

  // Estados del formulario
  const [showForm, setShowForm] = useState(false);
  const [editingRole, setEditingRole] = useState(null);
  const [formData, setFormData] = useState({
    nombre: '',
  });
  const [formErrors, setFormErrors] = useState({});

  // Estados de confirmación
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [roleToDelete, setRoleToDelete] = useState(null);

  // Configuración de columnas para la tabla
  const columns = [
    {
      key: 'id',
      title: 'ID',
      width: '80px',
      sortable: true,
    },
    {
      key: 'nombre',
      title: 'Nombre del Rol',
      sortable: true,
      render: (value) => (
        <span className={`badge bg-${value?.toLowerCase() === 'administrador' ? 'danger' : 'primary'} rounded-pill`}>
          {value}
        </span>
      ),
    },
    {
      key: 'Usuarios.length',
      title: 'Usuarios Asociados',
      render: (value, row) => (
        <span className="text-muted">
          {row.Usuarios?.length || 0} usuarios
        </span>
      ),
    },
    {
      key: 'createdAt',
      title: 'Fecha de creación',
      type: 'date',
      sortable: true,
    },
  ];

  // Acciones de la tabla
  const actions = [
    {
      icon: '✏️',
      title: 'Editar rol',
      variant: 'primary',
      onClick: handleEdit,
    },
    {
      icon: '🗑️',
      title: 'Eliminar rol',
      variant: 'danger',
      onClick: handleDeleteClick,
      disabled: (row) => (row.Usuarios?.length || 0) > 0, // No permitir eliminar roles con usuarios
    },
  ];

  // Limpiar mensajes cuando se monta el componente
  useEffect(() => {
    clearMessages();
  }, [clearMessages]);

  // Manejar cambios en el formulario
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Limpiar error del campo si existe
    if (formErrors[name]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  // Validar formulario
  const validateForm = () => {
    const errors = {};

    if (!formData.nombre.trim()) {
      errors.nombre = 'El nombre del rol es obligatorio';
    } else if (formData.nombre.trim().length < 3) {
      errors.nombre = 'El nombre debe tener al menos 3 caracteres';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Abrir formulario para crear rol
  const handleCreate = () => {
    setEditingRole(null);
    setFormData({
      nombre: '',
    });
    setFormErrors({});
    setShowForm(true);
  };

  // Abrir formulario para editar rol
  function handleEdit(role) {
    setEditingRole(role);
    setFormData({
      nombre: role.nombre || '',
    });
    setFormErrors({});
    setShowForm(true);
  }

  // Cerrar formulario
  const handleCloseForm = () => {
    setShowForm(false);
    setEditingRole(null);
    setFormData({
      nombre: '',
    });
    setFormErrors({});
  };

  // Enviar formulario
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    let success;
    if (editingRole) {
      success = await update(editingRole.id, formData);
    } else {
      success = await create(formData);
    }

    if (success) {
      handleCloseForm();
    }
  };

  // Manejar clic en eliminar
  function handleDeleteClick(role) {
    setRoleToDelete(role);
    setShowDeleteConfirm(true);
  }

  // Confirmar eliminación
  const handleConfirmDelete = async () => {
    if (roleToDelete) {
      const success = await remove(roleToDelete.id);
      if (success) {
        setShowDeleteConfirm(false);
        setRoleToDelete(null);
      }
    }
  };

  // Cancelar eliminación
  const handleCancelDelete = () => {
    setShowDeleteConfirm(false);
    setRoleToDelete(null);
  };

  return (
    <AdminLayout>
      <div className="container-fluid">
        {/* Header */}
        <div className="d-flex justify-content-between align-items-start mb-4">
          <div>
            <h1 className="h2 mb-2">🔑 Gestión de Roles</h1>
            <p className="text-muted mb-0">Administra los roles y permisos del sistema</p>
          </div>
          <button
            className="btn btn-primary"
            onClick={handleCreate}
          >
            ➕ Nuevo Rol
          </button>
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

        {/* Información adicional */}
        <div className="alert alert-info">
          <span>ℹ️ Los roles definen los permisos de los usuarios. No puedes eliminar un rol que tenga usuarios asociados.</span>
        </div>

        {/* Tabla de roles */}
        <DataTable
          data={roles}
          columns={columns}
          actions={actions}
          loading={loading}
          error={error}
          emptyMessage="No hay roles creados"
        />

        {/* Modal de formulario */}
        <FormModal
          isOpen={showForm}
          onClose={handleCloseForm}
          onSubmit={handleSubmit}
          title={editingRole ? 'Editar Rol' : 'Nuevo Rol'}
          submitText={editingRole ? 'Actualizar' : 'Crear'}
          loading={loading}
          size="small"
        >
          <div className="mb-3">
            <label htmlFor="nombre" className="form-label">Nombre del Rol *</label>
            <input
              type="text"
              id="nombre"
              name="nombre"
              value={formData.nombre}
              onChange={handleInputChange}
              placeholder="Ej: Administrador, Cliente, Moderador"
              className={`form-control ${formErrors.nombre ? 'is-invalid' : ''}`}
              autoFocus
            />
            {formErrors.nombre && (
              <div className="invalid-feedback">{formErrors.nombre}</div>
            )}
            <div className="form-text">
              El nombre del rol debe ser descriptivo y único en el sistema.
            </div>
          </div>
        </FormModal>

        {/* Modal de confirmación de eliminación */}
        <ConfirmModal
          isOpen={showDeleteConfirm}
          onClose={handleCancelDelete}
          onConfirm={handleConfirmDelete}
          title="Eliminar Rol"
          message={
            roleToDelete?.Usuarios?.length > 0
              ? `No puedes eliminar el rol "${roleToDelete?.nombre}" porque tiene ${roleToDelete.Usuarios.length} usuario(s) asociado(s). Primero debes reasignar estos usuarios a otro rol.`
              : `¿Estás seguro de que deseas eliminar el rol "${roleToDelete?.nombre}"? Esta acción no se puede deshacer.`
          }
          confirmText="Eliminar"
          variant="danger"
          loading={loading}
        />
      </div>
    </AdminLayout>
  );
};

export default Roles;
