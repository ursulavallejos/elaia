/**
 * Página de Administración de Usuarios - ELAIA E-commerce
 * 
 * Interfaz completa para la gestión de usuarios del sistema.
 * Incluye listado, creación, edición y eliminación de usuarios.
 * 
 * Características:
 * - Tabla de datos con búsqueda y paginación
 * - Formularios modales para crear/editar usuarios
 * - Validación de formularios
 * - Gestión de roles de usuario
 * - Confirmaciones de eliminación
 * - Manejo de estados y errores
 * 
 * @author Equipo de Desarrollo ELAIA
 * @version 1.0.0
 */

import React, { useState, useEffect } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import DataTable from '../../components/admin/DataTable';
import { FormModal, ConfirmModal } from '../../components/admin/Modal';
import { useUsuarios, useRoles } from '../../hooks/useAdmin';

const Usuarios = () => {
  const {
    usuarios,
    loading,
    error,
    success,
    create,
    update,
    remove,
    clearMessages,
  } = useUsuarios();

  const {
    roles,
    loading: rolesLoading,
  } = useRoles();

  // Estados del formulario
  const [showForm, setShowForm] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    email: '',
    password: '',
    id_rol: '',
  });
  const [formErrors, setFormErrors] = useState({});

  // Estados de confirmación
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);

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
      title: 'Nombre',
      sortable: true,
    },
    {
      key: 'apellido',
      title: 'Apellido',
      sortable: true,
    },
    {
      key: 'email',
      title: 'Email',
      sortable: true,
    },
    {
      key: 'Rol.nombre',
      title: 'Rol',
      sortable: true,
      render: (value, row) => (
        <span className={`badge ${value?.toLowerCase() === 'administrador' ? 'bg-danger' : 'bg-primary'}`}>
          {value || 'Sin rol'}
        </span>
      ),
    },
    {
      key: 'createdAt',
      title: 'Fecha de registro',
      type: 'date',
      sortable: true,
    },
  ];

  // Acciones de la tabla
  const actions = [
    {
      icon: '✏️',
      title: 'Editar usuario',
      variant: 'primary',
      onClick: handleEdit,
    },
    {
      icon: '🗑️',
      title: 'Eliminar usuario',
      variant: 'danger',
      onClick: handleDeleteClick,
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
      errors.nombre = 'El nombre es obligatorio';
    }

    if (!formData.apellido.trim()) {
      errors.apellido = 'El apellido es obligatorio';
    }

    if (!formData.email.trim()) {
      errors.email = 'El email es obligatorio';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'El email no es válido';
    }

    if (!editingUser && !formData.password.trim()) {
      errors.password = 'La contraseña es obligatoria';
    } else if (formData.password && formData.password.length < 6) {
      errors.password = 'La contraseña debe tener al menos 6 caracteres';
    }

    if (!formData.id_rol) {
      errors.id_rol = 'Debe seleccionar un rol';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Abrir formulario para crear usuario
  const handleCreate = () => {
    setEditingUser(null);
    setFormData({
      nombre: '',
      apellido: '',
      email: '',
      password: '',
      id_rol: '',
    });
    setFormErrors({});
    setShowForm(true);
  };

  // Abrir formulario para editar usuario
  function handleEdit(user) {
    setEditingUser(user);
    setFormData({
      nombre: user.nombre || '',
      apellido: user.apellido || '',
      email: user.email || '',
      password: '', // No mostrar contraseña existente
      id_rol: user.id_rol || '',
    });
    setFormErrors({});
    setShowForm(true);
  }

  // Cerrar formulario
  const handleCloseForm = () => {
    setShowForm(false);
    setEditingUser(null);
    setFormData({
      nombre: '',
      apellido: '',
      email: '',
      password: '',
      id_rol: '',
    });
    setFormErrors({});
  };

  // Enviar formulario
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    const userData = { ...formData };
    
    // Si estamos editando y no se proporcionó nueva contraseña, omitirla
    if (editingUser && !userData.password) {
      delete userData.password;
    }

    let success;
    if (editingUser) {
      success = await update(editingUser.id, userData);
    } else {
      success = await create(userData);
    }

    if (success) {
      handleCloseForm();
    }
  };

  // Manejar clic en eliminar
  function handleDeleteClick(user) {
    setUserToDelete(user);
    setShowDeleteConfirm(true);
  }

  // Confirmar eliminación
  const handleConfirmDelete = async () => {
    if (userToDelete) {
      const success = await remove(userToDelete.id);
      if (success) {
        setShowDeleteConfirm(false);
        setUserToDelete(null);
      }
    }
  };

  // Cancelar eliminación
  const handleCancelDelete = () => {
    setShowDeleteConfirm(false);
    setUserToDelete(null);
  };

  return (
    <AdminLayout>
      <div className="container-fluid">
        {/* Header */}
        <div className="d-flex justify-content-between align-items-start mb-4">
          <div>
            <h1 className="h2 mb-2">👥 Gestión de Usuarios</h1>
            <p className="text-muted mb-0">Administra usuarios, roles y permisos del sistema</p>
          </div>
          <button
            className="btn btn-primary"
            onClick={handleCreate}
          >
            ➕ Nuevo Usuario
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

        {/* Tabla de usuarios */}
        <DataTable
          data={usuarios}
          columns={columns}
          actions={actions}
          loading={loading}
          error={error}
          emptyMessage="No hay usuarios registrados"
        />

        {/* Modal de formulario */}
        <FormModal
          isOpen={showForm}
          onClose={handleCloseForm}
          onSubmit={handleSubmit}
          title={editingUser ? 'Editar Usuario' : 'Nuevo Usuario'}
          submitText={editingUser ? 'Actualizar' : 'Crear'}
          loading={loading}
          size="medium"
        >
          <div className="row g-3">
            <div className="col-md-6">
              <label htmlFor="nombre" className="form-label">Nombre *</label>
              <input
                type="text"
                id="nombre"
                name="nombre"
                value={formData.nombre}
                onChange={handleInputChange}
                placeholder="Ingrese el nombre"
                className={`form-control ${formErrors.nombre ? 'is-invalid' : ''}`}
              />
              {formErrors.nombre && (
                <div className="invalid-feedback">{formErrors.nombre}</div>
              )}
            </div>

            <div className="col-md-6">
              <label htmlFor="apellido" className="form-label">Apellido *</label>
              <input
                type="text"
                id="apellido"
                name="apellido"
                value={formData.apellido}
                onChange={handleInputChange}
                placeholder="Ingrese el apellido"
                className={`form-control ${formErrors.apellido ? 'is-invalid' : ''}`}
              />
              {formErrors.apellido && (
                <div className="invalid-feedback">{formErrors.apellido}</div>
              )}
            </div>

            <div className="col-12">
              <label htmlFor="email" className="form-label">Email *</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Ingrese el email"
                className={`form-control ${formErrors.email ? 'is-invalid' : ''}`}
              />
              {formErrors.email && (
                <div className="invalid-feedback">{formErrors.email}</div>
              )}
            </div>

            <div className="col-12">
              <label htmlFor="password" className="form-label">
                {editingUser ? 'Nueva Contraseña (dejar vacío para mantener actual)' : 'Contraseña *'}
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder={editingUser ? 'Nueva contraseña' : 'Ingrese la contraseña'}
                className={`form-control ${formErrors.password ? 'is-invalid' : ''}`}
              />
              {formErrors.password && (
                <div className="invalid-feedback">{formErrors.password}</div>
              )}
            </div>

            <div className="col-12">
              <label htmlFor="id_rol" className="form-label">Rol *</label>
              <select
                id="id_rol"
                name="id_rol"
                value={formData.id_rol}
                onChange={handleInputChange}
                className={`form-select ${formErrors.id_rol ? 'is-invalid' : ''}`}
                disabled={rolesLoading}
              >
                <option value="">Selecciona un rol</option>
                {roles.map(rol => (
                  <option key={rol.id} value={rol.id}>
                    {rol.nombre}
                  </option>
                ))}
              </select>
              {formErrors.id_rol && (
                <div className="invalid-feedback">{formErrors.id_rol}</div>
              )}
            </div>
          </div>
        </FormModal>

        {/* Modal de confirmación de eliminación */}
        <ConfirmModal
          isOpen={showDeleteConfirm}
          onClose={handleCancelDelete}
          onConfirm={handleConfirmDelete}
          title="Eliminar Usuario"
          message={`¿Estás seguro de que deseas eliminar al usuario "${userToDelete?.nombre} ${userToDelete?.apellido}"? Esta acción no se puede deshacer.`}
          confirmText="Eliminar"
          variant="danger"
          loading={loading}
        />
      </div>
    </AdminLayout>
  );
};

export default Usuarios;
