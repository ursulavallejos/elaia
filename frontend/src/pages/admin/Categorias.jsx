/**
 * Página de Administración de Categorías - ELAIA E-commerce
 * 
 * Interfaz para la gestión de categorías de productos.
 * Permite crear, editar y eliminar categorías del sistema.
 * 
 * @author Equipo de Desarrollo ELAIA
 * @version 1.0.0
 */

import React, { useState, useEffect } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import DataTable from '../../components/admin/DataTable';
import { FormModal, ConfirmModal } from '../../components/admin/Modal';
import { useCategorias } from '../../hooks/useAdmin';


const Categorias = () => {
  const {
    categorias,
    loading,
    error,
    success,
    create,
    update,
    remove,
    clearMessages,
  } = useCategorias();

  // Estados del formulario
  const [showForm, setShowForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [formData, setFormData] = useState({
    nombre: '',
  });
  const [formErrors, setFormErrors] = useState({});

  // Estados de confirmación
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState(null);

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
      title: 'Nombre de la Categoría',
      sortable: true,
      render: (value) => (
        <span className="fw-medium">
          📂 {value}
        </span>
      ),
    },
    {
      key: 'Productos.length',
      title: 'Productos Asociados',
      render: (value, row) => (
        <span className="text-muted">
          {row.Productos?.length || 0} productos
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
      title: 'Editar categoría',
      variant: 'primary',
      onClick: handleEdit,
    },
    {
      icon: '🗑️',
      title: 'Eliminar categoría',
      variant: 'danger',
      onClick: handleDeleteClick,
      disabled: (row) => (row.Productos?.length || 0) > 0, // No permitir eliminar categorías con productos
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
      errors.nombre = 'El nombre de la categoría es obligatorio';
    } else if (formData.nombre.trim().length < 2) {
      errors.nombre = 'El nombre debe tener al menos 2 caracteres';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Abrir formulario para crear categoría
  const handleCreate = () => {
    setEditingCategory(null);
    setFormData({
      nombre: '',
    });
    setFormErrors({});
    setShowForm(true);
  };



  // Abrir formulario para editar categoría
  function handleEdit(category) {
    setEditingCategory(category);
    setFormData({
      nombre: category.nombre || '',
    });
    setFormErrors({});
    setShowForm(true);
  }

  // Cerrar formulario
  const handleCloseForm = () => {
    setShowForm(false);
    setEditingCategory(null);
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
    if (editingCategory) {
      success = await update(editingCategory.id, formData);
    } else {
      success = await create(formData);
    }

    if (success) {
      handleCloseForm();
    }
  };

  // Manejar clic en eliminar
  function handleDeleteClick(category) {
    setCategoryToDelete(category);
    setShowDeleteConfirm(true);
  }

  // Confirmar eliminación
  const handleConfirmDelete = async () => {
    if (categoryToDelete) {
      const success = await remove(categoryToDelete.id);
      if (success) {
        setShowDeleteConfirm(false);
        setCategoryToDelete(null);
      }
    }
  };

  // Cancelar eliminación
  const handleCancelDelete = () => {
    setShowDeleteConfirm(false);
    setCategoryToDelete(null);
  };

  return (
    <AdminLayout>
      <div className="container-fluid">
        {/* Header */}
        <div className="d-flex justify-content-between align-items-start mb-4">
          <div>
            <h1 className="h2 mb-2">📂 Gestión de Categorías</h1>
            <p className="text-muted mb-0">Organiza productos en categorías para mejor navegación</p>
          </div>
          <button
            className="btn btn-primary"
            onClick={handleCreate}
          >
            ➕ Nueva Categoría
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
          <span>ℹ️ Las categorías te ayudan a organizar tus productos. No puedes eliminar una categoría que tenga productos asociados.</span>
        </div>

        {/* Estadísticas rápidas */}
        <div className="row g-3 mb-4">
          <div className="col-md-4">
            <div className="card bg-primary text-white">
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <h6 className="card-title mb-1">Total Categorías</h6>
                    <h3 className="mb-0">{categorias.length}</h3>
                  </div>
                  <span className="fs-1">📂</span>
                </div>
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card bg-success text-white">
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <h6 className="card-title mb-1">Con Productos</h6>
                    <h3 className="mb-0">{categorias.filter(c => (c.Productos?.length || 0) > 0).length}</h3>
                  </div>
                  <span className="fs-1">📦</span>
                </div>
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card bg-warning text-dark">
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <h6 className="card-title mb-1">Vacías</h6>
                    <h3 className="mb-0">{categorias.filter(c => (c.Productos?.length || 0) === 0).length}</h3>
                  </div>
                  <span className="fs-1">📭</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabla de categorías */}
        <DataTable
          data={categorias}
          columns={columns}
          actions={actions}
          loading={loading}
          error={error}
          emptyMessage="No hay categorías creadas"
        />

        {/* Modal de formulario */}
        <FormModal
          isOpen={showForm}
          onClose={handleCloseForm}
          onSubmit={handleSubmit}
          title={editingCategory ? 'Editar Categoría' : 'Nueva Categoría'}
          submitText={editingCategory ? 'Actualizar' : 'Crear'}
          loading={loading}
          size="small"
        >
          <div className="mb-3">
            <label htmlFor="nombre" className="form-label">Nombre de la Categoría *</label>
            <input
              type="text"
              id="nombre"
              name="nombre"
              value={formData.nombre}
              onChange={handleInputChange}
              placeholder="Ej: Batas, Cosmetiqueros, Accesorios"
              className={`form-control ${formErrors.nombre ? 'is-invalid' : ''}`}
              autoFocus
            />
            {formErrors.nombre && (
              <div className="invalid-feedback">{formErrors.nombre}</div>
            )}
            <div className="form-text">
              Usa nombres descriptivos y únicos para las categorías.
            </div>
          </div>
        </FormModal>

        {/* Modal de confirmación de eliminación */}
        <ConfirmModal
          isOpen={showDeleteConfirm}
          onClose={handleCancelDelete}
          onConfirm={handleConfirmDelete}
          title="Eliminar Categoría"
          message={
            categoryToDelete?.Productos?.length > 0
              ? `No puedes eliminar la categoría "${categoryToDelete?.nombre}" porque tiene ${categoryToDelete.Productos.length} producto(s) asociado(s). Primero debes reasignar estos productos a otra categoría.`
              : `¿Estás seguro de que deseas eliminar la categoría "${categoryToDelete?.nombre}"? Esta acción no se puede deshacer.`
          }
          confirmText="Eliminar"
          variant="danger"
          loading={loading}
        />
      </div>
    </AdminLayout>
  );
};

export default Categorias;
