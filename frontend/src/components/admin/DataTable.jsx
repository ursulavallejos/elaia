/**
 * Componente DataTable Reutilizable - ELAIA E-commerce Admin
 * 
 * Tabla de datos genérica y reutilizable para mostrar información administrativa.
 * Incluye funcionalidades de búsqueda, paginación, ordenamiento y acciones.
 * 
 * Características:
 * - Búsqueda en tiempo real
 * - Paginación configurable
 * - Ordenamiento por columnas
 * - Acciones personalizadas por fila
 * - Estados de carga y error
 * - Diseño responsivo
 * 
 * @author Equipo de Desarrollo ELAIA
 * @version 1.0.0
 */

import React, { useState, useMemo } from 'react';

const DataTable = ({
  data = [],
  columns = [],
  loading = false,
  error = null,
  searchable = true,
  sortable = true,
  paginated = true,
  pageSize = 10,
  actions = [],
  emptyMessage = "No hay datos disponibles",
  className = "",
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [currentPage, setCurrentPage] = useState(1);

  // Filtrar datos por búsqueda
  const filteredData = useMemo(() => {
    if (!searchTerm || !searchable) return data;
    
    return data.filter(row => {
      return columns.some(column => {
        const value = getNestedValue(row, column.key);
        return value?.toString().toLowerCase().includes(searchTerm.toLowerCase());
      });
    });
  }, [data, searchTerm, columns, searchable]);

  // Ordenar datos
  const sortedData = useMemo(() => {
    if (!sortConfig.key || !sortable) return filteredData;
    
    return [...filteredData].sort((a, b) => {
      const aValue = getNestedValue(a, sortConfig.key);
      const bValue = getNestedValue(b, sortConfig.key);
      
      if (aValue < bValue) {
        return sortConfig.direction === 'asc' ? -1 : 1;
      }
      if (aValue > bValue) {
        return sortConfig.direction === 'asc' ? 1 : -1;
      }
      return 0;
    });
  }, [filteredData, sortConfig, sortable]);

  // Paginar datos
  const paginatedData = useMemo(() => {
    if (!paginated) return sortedData;
    
    const startIndex = (currentPage - 1) * pageSize;
    return sortedData.slice(startIndex, startIndex + pageSize);
  }, [sortedData, currentPage, pageSize, paginated]);

  // Calcular información de paginación
  const totalPages = Math.ceil(sortedData.length / pageSize);
  const startRecord = (currentPage - 1) * pageSize + 1;
  const endRecord = Math.min(currentPage * pageSize, sortedData.length);

  // Función helper para obtener valores anidados
  function getNestedValue(obj, path) {
    return path.split('.').reduce((current, key) => current?.[key], obj);
  }

  // Manejar ordenamiento
  const handleSort = (key) => {
    if (!sortable) return;
    
    setSortConfig(prevConfig => ({
      key,
      direction: prevConfig.key === key && prevConfig.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  // Renderizar celda
  const renderCell = (row, column) => {
    const value = getNestedValue(row, column.key);
    
    if (column.render) {
      return column.render(value, row);
    }
    
    if (column.type === 'boolean') {
      return value ? '✅' : '❌';
    }
    
    if (column.type === 'currency') {
      return new Intl.NumberFormat('es-CL', {
        style: 'currency',
        currency: 'CLP'
      }).format(value);
    }
    
    if (column.type === 'date') {
      return new Date(value).toLocaleDateString('es-CL');
    }
    
    return value?.toString() || '-';
  };

  // Renderizar estados de error y carga
  if (error) {
    return (
      <div className="text-center p-5">
        <div className="text-danger">
          <span className="fs-1">⚠️</span>
          <p className="mt-2">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`card ${className}`}>
      {/* Header con búsqueda */}
      {searchable && (
        <div className="card-header bg-light">
          <div className="position-relative" style={{maxWidth: '400px'}}>
            <input
              type="text"
              placeholder="Buscar..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1); // Reset a primera página al buscar
              }}
              className="form-control ps-5"
            />
            <span className="position-absolute top-50 start-0 translate-middle-y ms-3">🔍</span>
          </div>
        </div>
      )}

      {/* Tabla */}
      <div className="table-responsive">
        <table className="table table-hover mb-0">
          <thead className="table-light">
            <tr>
              {columns.map((column) => (
                <th
                  key={column.key}
                  className={`${sortable && column.sortable !== false ? 'user-select-none' : ''}`}
                  onClick={() => column.sortable !== false && handleSort(column.key)}
                  style={{ 
                    width: column.width,
                    cursor: sortable && column.sortable !== false ? 'pointer' : 'default'
                  }}
                >
                  <div className="d-flex justify-content-between align-items-center">
                    <span>{column.title}</span>
                    {sortable && column.sortable !== false && (
                      <span className="text-muted small">
                        {sortConfig.key === column.key ? (
                          sortConfig.direction === 'asc' ? '↑' : '↓'
                        ) : '↕️'}
                      </span>
                    )}
                  </div>
                </th>
              ))}
              {actions.length > 0 && (
                <th className="text-center" style={{width: '120px'}}>Acciones</th>
              )}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={columns.length + (actions.length > 0 ? 1 : 0)} className="text-center p-5">
                  <div className="d-flex flex-column align-items-center">
                    <div className="spinner-border text-primary mb-3" role="status">
                      <span className="visually-hidden">Cargando...</span>
                    </div>
                    <span>Cargando...</span>
                  </div>
                </td>
              </tr>
            ) : paginatedData.length === 0 ? (
              <tr>
                <td colSpan={columns.length + (actions.length > 0 ? 1 : 0)} className="text-center p-5">
                  <div className="text-muted">
                    <span className="fs-1 opacity-50">📭</span>
                    <p className="mt-2 mb-0">{emptyMessage}</p>
                  </div>
                </td>
              </tr>
            ) : (
              paginatedData.map((row, index) => (
                <tr key={row.id || index}>
                  {columns.map((column) => (
                    <td 
                      key={column.key} 
                      className={
                        column.type === 'currency' ? 'text-end fw-medium text-success' :
                        column.type === 'date' ? 'text-muted' :
                        column.type === 'boolean' ? 'text-center' :
                        ''
                      }
                    >
                      {renderCell(row, column)}
                    </td>
                  ))}
                  {actions.length > 0 && (
                    <td className="text-center">
                      <div className="btn-group btn-group-sm" role="group">
                        {actions.map((action, actionIndex) => (
                          <button
                            key={actionIndex}
                            className={`btn btn-outline-${action.variant || 'primary'}`}
                            onClick={() => action.onClick(row)}
                            title={action.title}
                            disabled={action.disabled && action.disabled(row)}
                          >
                            {action.icon && <span className="me-1">{action.icon}</span>}
                            {action.label && <span className="d-none d-lg-inline">{action.label}</span>}
                          </button>
                        ))}
                      </div>
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Footer con paginación */}
      {paginated && !loading && sortedData.length > 0 && (
        <div className="card-footer bg-light d-flex justify-content-between align-items-center">
          <small className="text-muted">
            Mostrando {startRecord}-{endRecord} de {sortedData.length} registros
          </small>
          
          {totalPages > 1 && (
            <nav aria-label="Navegación de tabla">
              <ul className="pagination pagination-sm mb-0">
                <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                  <button
                    className="page-link"
                    onClick={() => setCurrentPage(1)}
                    disabled={currentPage === 1}
                  >
                    ⏮️
                  </button>
                </li>
                <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                  <button
                    className="page-link"
                    onClick={() => setCurrentPage(currentPage - 1)}
                    disabled={currentPage === 1}
                  >
                    ◀️
                  </button>
                </li>
                
                <li className="page-item active">
                  <span className="page-link">
                    Página {currentPage} de {totalPages}
                  </span>
                </li>
                
                <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                  <button
                    className="page-link"
                    onClick={() => setCurrentPage(currentPage + 1)}
                    disabled={currentPage === totalPages}
                  >
                    ▶️
                  </button>
                </li>
                <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                  <button
                    className="page-link"
                    onClick={() => setCurrentPage(totalPages)}
                    disabled={currentPage === totalPages}
                  >
                    ⏭️
                  </button>
                </li>
              </ul>
            </nav>
          )}
        </div>
      )}
    </div>
  );
};

export default DataTable;
