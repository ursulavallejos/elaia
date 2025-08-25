/**
 * Página de Administración de Productos - ELAIA E-commerce
 * 
 * Interfaz completa para la gestión de productos del catálogo.
 * Incluye creación, edición, eliminación y gestión de categorías.
 * 
 * @author Equipo de Desarrollo ELAIA
 * @version 1.0.0
 */

import React, { useState, useEffect } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import DataTable from '../../components/admin/DataTable';
import { FormModal, ConfirmModal } from '../../components/admin/Modal';
import { useProductos, useCategorias } from '../../hooks/useAdmin';


const Productos = () => {
  const {
    productos,
    loading,
    error,
    success,
    create,
    update,
    remove,
    clearMessages,
  } = useProductos();

  const {
    categorias,
    loading: categoriasLoading,
  } = useCategorias();

  // Estados del formulario
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    precio: '',
    imagen_url: '',
    categorias: [],
  });
  const [formErrors, setFormErrors] = useState({});

  // Estados de confirmación
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);

  // Configuración de columnas para la tabla
  const columns = [
    {
      key: 'id',
      title: 'ID',
      width: '80px',
      sortable: true,
    },
    {
      key: 'imagen_url',
      title: 'Imagen',
      width: '80px',
      sortable: false,
      render: (value, row) => (
        <div className="d-flex align-items-center justify-content-center">
          {value ? (
            <img 
              src={value} 
              alt={row.nombre}
              className="rounded"
              style={{width: '50px', height: '50px', objectFit: 'cover'}}
              onError={(e) => {
                e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNTAiIGhlaWdodD0iNTAiIHZpZXdCb3g9IjAgMCA1MCA1MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjUwIiBoZWlnaHQ9IjUwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0yNSAyMEM2LjcxNTcyIDIwIDIwIDI2LjcxNTcgMjAgMjVTMjYuNzE1NyAzMCAyNSAzMFMzMCAyNi43MTU3IDMwIDI1IDI2LjcxNTcgMjAgMjUgMjBaIiBmaWxsPSIjOTNBM0I4Ii8+CjwvcGF0aD4KPC9zdmc+';
              }}
            />
          ) : (
            <div 
              className="d-flex align-items-center justify-content-center bg-light border rounded text-muted"
              style={{width: '50px', height: '50px', fontSize: '20px'}}
            >
              📷
            </div>
          )}
        </div>
      ),
    },
    {
      key: 'nombre',
      title: 'Nombre',
      sortable: true,
    },
    {
      key: 'precio',
      title: 'Precio',
      type: 'currency',
      sortable: true,
    },

    {
      key: 'Categoria',
      title: 'Categorías',
      render: (value, row) => (
        <div className="d-flex flex-wrap gap-1">
          {row.Categoria?.map(cat => (
            <span key={cat.id} className="badge bg-secondary rounded-pill">
              {cat.nombre}
            </span>
          )) || <span className="text-muted">Sin categorías</span>}
        </div>
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
      title: 'Editar producto',
      variant: 'primary',
      onClick: handleEdit,
    },
    {
      icon: '🗑️',
      title: 'Eliminar producto',
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
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Limpiar error del campo si existe
    if (formErrors[name]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  // Manejar cambio de categorías
  const handleCategoryChange = (categoryId) => {
    setFormData(prev => {
      const currentCategories = prev.categorias || [];
      const isSelected = currentCategories.includes(parseInt(categoryId));
      
      if (isSelected) {
        return {
          ...prev,
          categorias: currentCategories.filter(id => id !== parseInt(categoryId))
        };
      } else {
        return {
          ...prev,
          categorias: [...currentCategories, parseInt(categoryId)]
        };
      }
    });
  };

  // Validar formulario
  const validateForm = () => {
    const errors = {};

    if (!formData.nombre.trim()) {
      errors.nombre = 'El nombre del producto es obligatorio';
    }

    if (!formData.precio || parseFloat(formData.precio) <= 0) {
      errors.precio = 'El precio debe ser mayor a 0';
    }

    if (formData.imagen_url && !isValidUrl(formData.imagen_url)) {
      errors.imagen_url = 'La URL de la imagen no es válida';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Validar URL
  const isValidUrl = (string) => {
    try {
      new URL(string);
      return true;
    } catch (_) {
      return false;
    }
  };

  // Abrir formulario para crear producto
  const handleCreate = () => {
    setEditingProduct(null);
    setFormData({
      nombre: '',
      descripcion: '',
      precio: '',
      imagen_url: '',

      categorias: [],
    });
    setFormErrors({});
    setShowForm(true);
  };



  // Abrir formulario para editar producto
  function handleEdit(product) {
    setEditingProduct(product);
    setFormData({
      nombre: product.nombre || '',
      descripcion: product.descripcion || '',
      precio: product.precio || '',
      imagen_url: product.imagen_url || '',

      categorias: product.Categoria?.map(cat => cat.id) || [],
    });
    setFormErrors({});
    setShowForm(true);
  }

  // Cerrar formulario
  const handleCloseForm = () => {
    setShowForm(false);
    setEditingProduct(null);
    setFormData({
      nombre: '',
      descripcion: '',
      precio: '',
      imagen_url: '',

      categorias: [],
    });
    setFormErrors({});
  };

  // Enviar formulario
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    const productData = {
      ...formData,
      precio: parseFloat(formData.precio),
    };

    let success;
    if (editingProduct) {
      success = await update(editingProduct.id, productData);
    } else {
      success = await create(productData);
    }

    if (success) {
      handleCloseForm();
    }
  };

  // Manejar clic en eliminar
  function handleDeleteClick(product) {
    setProductToDelete(product);
    setShowDeleteConfirm(true);
  }

  // Confirmar eliminación
  const handleConfirmDelete = async () => {
    if (productToDelete) {
      const success = await remove(productToDelete.id);
      if (success) {
        setShowDeleteConfirm(false);
        setProductToDelete(null);
      }
    }
  };

  // Cancelar eliminación
  const handleCancelDelete = () => {
    setShowDeleteConfirm(false);
    setProductToDelete(null);
  };

  return (
    <AdminLayout>
      <div className="container-fluid">
        {/* Header */}
        <div className="d-flex justify-content-between align-items-start mb-4">
          <div>
            <h1 className="h2 mb-2">🛍️ Gestión de Productos</h1>
            <p className="text-muted mb-0">Administra el catálogo de productos, precios y categorías</p>
          </div>
          <button
            className="btn btn-primary"
            onClick={handleCreate}
          >
            ➕ Nuevo Producto
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

        {/* Estadísticas rápidas */}
        <div className="row g-3 mb-4">
          <div className="col-md-4">
            <div className="card bg-primary text-white">
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <h6 className="card-title mb-1">Total Productos</h6>
                    <h3 className="mb-0">{productos.length}</h3>
                  </div>
                  <span className="fs-1">📦</span>
                </div>
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card bg-success text-white">
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <h6 className="card-title mb-1">Con Imagen</h6>
                    <h3 className="mb-0">{productos.filter(p => p.imagen_url).length}</h3>
                  </div>
                  <span className="fs-1">📷</span>
                </div>
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card bg-warning text-dark">
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <h6 className="card-title mb-1">Sin Imagen</h6>
                    <h3 className="mb-0">{productos.filter(p => !p.imagen_url).length}</h3>
                  </div>
                  <span className="fs-1">🖼️</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabla de productos */}
        <DataTable
          data={productos}
          columns={columns}
          actions={actions}
          loading={loading}
          error={error}
          emptyMessage="No hay productos en el catálogo"
        />

        {/* Modal de formulario */}
        <FormModal
          isOpen={showForm}
          onClose={handleCloseForm}
          onSubmit={handleSubmit}
          title={editingProduct ? 'Editar Producto' : 'Nuevo Producto'}
          submitText={editingProduct ? 'Actualizar' : 'Crear'}
          loading={loading}
          size="large"
        >
          <div className="row g-3">
            <div className="col-md-6">
              <label htmlFor="nombre" className="form-label">Nombre del Producto *</label>
              <input
                type="text"
                id="nombre"
                name="nombre"
                value={formData.nombre}
                onChange={handleInputChange}
                placeholder="Ej: Bata de Verano Coral"
                className={`form-control ${formErrors.nombre ? 'is-invalid' : ''}`}
              />
              {formErrors.nombre && (
                <div className="invalid-feedback">{formErrors.nombre}</div>
              )}
            </div>

            <div className="col-md-6">
              <label htmlFor="precio" className="form-label">Precio (CLP) *</label>
              <input
                type="number"
                id="precio"
                name="precio"
                value={formData.precio}
                onChange={handleInputChange}
                placeholder="0"
                min="0"
                step="0.01"
                className={`form-control ${formErrors.precio ? 'is-invalid' : ''}`}
              />
              {formErrors.precio && (
                <div className="invalid-feedback">{formErrors.precio}</div>
              )}
            </div>

            <div className="col-12">
              <label htmlFor="descripcion" className="form-label">Descripción</label>
              <textarea
                id="descripcion"
                name="descripcion"
                value={formData.descripcion}
                onChange={handleInputChange}
                placeholder="Describe las características del producto..."
                rows={4}
                className="form-control"
              />
            </div>

            <div className="col-12">
              <label htmlFor="imagen_url" className="form-label">URL de Imagen</label>
              <input
                type="url"
                id="imagen_url"
                name="imagen_url"
                value={formData.imagen_url}
                onChange={handleInputChange}
                placeholder="https://ejemplo.com/imagen.jpg o /imagen.jpg"
                className={`form-control ${formErrors.imagen_url ? 'is-invalid' : ''}`}
              />
              {formErrors.imagen_url && (
                <div className="invalid-feedback">{formErrors.imagen_url}</div>
              )}
              <div className="form-text">
                Puedes usar URLs externas o rutas locales (ej: /bata-verano.jpg)
              </div>
            </div>

            <div className="col-12">
              <label className="form-label">Categorías</label>
              {categoriasLoading ? (
                <p className="text-muted">Cargando categorías...</p>
              ) : (
                <div className="row g-2">
                  {categorias.map(categoria => (
                    <div key={categoria.id} className="col-md-6">
                      <div className="form-check">
                        <input
                          type="checkbox"
                          id={`categoria-${categoria.id}`}
                          checked={formData.categorias.includes(categoria.id)}
                          onChange={() => handleCategoryChange(categoria.id)}
                          className="form-check-input"
                        />
                        <label htmlFor={`categoria-${categoria.id}`} className="form-check-label">
                          {categoria.nombre}
                        </label>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              <div className="form-text">
                Selecciona las categorías a las que pertenece este producto
              </div>
            </div>
          </div>
        </FormModal>

        {/* Modal de confirmación de eliminación */}
        <ConfirmModal
          isOpen={showDeleteConfirm}
          onClose={handleCancelDelete}
          onConfirm={handleConfirmDelete}
          title="Eliminar Producto"
          message={`¿Estás seguro de que deseas eliminar el producto "${productToDelete?.nombre}"? Esta acción no se puede deshacer.`}
          confirmText="Eliminar"
          variant="danger"
          loading={loading}
        />
      </div>
    </AdminLayout>
  );
};

export default Productos;
