/**
 * Hook personalizado para operaciones de administración - ELAIA E-commerce
 * 
 * Este hook centraliza toda la lógica de gestión administrativa incluyendo
 * operaciones CRUD para usuarios, roles, productos y categorías.
 * 
 * Características:
 * - Estados de carga unificados
 * - Manejo centralizado de errores
 * - Operaciones CRUD para todas las entidades
 * - Notificaciones de éxito y error
 * - Validación de permisos de administrador
 * - Actualización automática de datos
 * 
 * @author Equipo de Desarrollo ELAIA
 * @version 1.0.0
 */

import { useState, useEffect, useCallback } from 'react';
import { usuariosAPI, rolesAPI, productosAPI, categoriasAPI, pedidosAPI, isAdmin } from '../config/api';

/**
 * Hook principal para administración
 * @param {string} entity - Entidad a gestionar ('usuarios', 'roles', 'productos', 'categorias', 'pedidos')
 * @returns {Object} Estado y funciones para gestión administrativa
 */
export const useAdmin = (entity) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // Mapeo de APIs según entidad
  const getAPI = useCallback(() => {
    const apis = {
      usuarios: usuariosAPI,
      roles: rolesAPI,
      productos: productosAPI,
      categorias: categoriasAPI,
      pedidos: pedidosAPI,
    };
    return apis[entity];
  }, [entity]);

  /**
   * Limpiar mensajes de estado
   */
  const clearMessages = useCallback(() => {
    setError(null);
    setSuccess(null);
  }, []);

  /**
   * Cargar todos los elementos de la entidad
   */
  const loadData = useCallback(async (filters = {}) => {
    if (!isAdmin()) {
      setError('Acceso denegado: se requieren permisos de administrador');
      return;
    }

    setLoading(true);
    clearMessages();
    
    try {
      const api = getAPI();
      const response = await api.getAll(filters);
      
      // Extraer datos según la estructura de respuesta
      const items = response[entity] || response.data || response;
      setData(Array.isArray(items) ? items : []);
      
    } catch (err) {
      setError(`Error al cargar ${entity}: ${err.message}`);
      setData([]);
    } finally {
      setLoading(false);
    }
  }, [entity, getAPI, clearMessages]);

  /**
   * Crear nuevo elemento
   */
  const create = useCallback(async (itemData) => {
    if (!isAdmin()) {
      setError('Acceso denegado: se requieren permisos de administrador');
      return false;
    }

    setLoading(true);
    clearMessages();
    
    try {
      const api = getAPI();
      const response = await api.create(itemData);
      
      setSuccess(`${entity.slice(0, -1)} creado exitosamente`);
      await loadData(); // Recargar datos
      
      return response;
    } catch (err) {
      setError(`Error al crear ${entity.slice(0, -1)}: ${err.message}`);
      return false;
    } finally {
      setLoading(false);
    }
  }, [entity, getAPI, clearMessages, loadData]);

  /**
   * Actualizar elemento existente
   */
  const update = useCallback(async (id, itemData) => {
    if (!isAdmin()) {
      setError('Acceso denegado: se requieren permisos de administrador');
      return false;
    }

    setLoading(true);
    clearMessages();
    
    try {
      const api = getAPI();
      const response = await api.update(id, itemData);
      
      setSuccess(`${entity.slice(0, -1)} actualizado exitosamente`);
      await loadData(); // Recargar datos
      
      return response;
    } catch (err) {
      setError(`Error al actualizar ${entity.slice(0, -1)}: ${err.message}`);
      return false;
    } finally {
      setLoading(false);
    }
  }, [entity, getAPI, clearMessages, loadData]);

  /**
   * Eliminar elemento
   */
  const remove = useCallback(async (id) => {
    if (!isAdmin()) {
      setError('Acceso denegado: se requieren permisos de administrador');
      return false;
    }

    setLoading(true);
    clearMessages();
    
    try {
      const api = getAPI();
      await api.delete(id);
      
      setSuccess(`${entity.slice(0, -1)} eliminado exitosamente`);
      await loadData(); // Recargar datos
      
      return true;
    } catch (err) {
      setError(`Error al eliminar ${entity.slice(0, -1)}: ${err.message}`);
      return false;
    } finally {
      setLoading(false);
    }
  }, [entity, getAPI, clearMessages, loadData]);

  /**
   * Obtener elemento por ID
   */
  const getById = useCallback(async (id) => {
    setLoading(true);
    clearMessages();
    
    try {
      const api = getAPI();
      const response = await api.getById(id);
      return response;
    } catch (err) {
      setError(`Error al obtener ${entity.slice(0, -1)}: ${err.message}`);
      return null;
    } finally {
      setLoading(false);
    }
  }, [entity, getAPI, clearMessages]);

  // Cargar datos iniciales
  useEffect(() => {
    loadData();
  }, [loadData]);

  return {
    // Datos
    data,
    loading,
    error,
    success,
    
    // Operaciones CRUD
    loadData,
    create,
    update,
    remove,
    getById,
    
    // Utilidades
    clearMessages,
    isAdminUser: isAdmin(),
  };
};

/**
 * Hook específico para gestión de usuarios
 */
export const useUsuarios = () => {
  const adminHook = useAdmin('usuarios');
  
  return {
    ...adminHook,
    usuarios: adminHook.data,
  };
};

/**
 * Hook específico para gestión de roles
 */
export const useRoles = () => {
  const adminHook = useAdmin('roles');
  
  return {
    ...adminHook,
    roles: adminHook.data,
  };
};

/**
 * Hook específico para gestión de productos
 */
export const useProductos = () => {
  const adminHook = useAdmin('productos');
  
  // Función específica para actualizar estado de producto
  const updateEstado = useCallback(async (id, estado) => {
    try {
      await productosAPI.update(id, { estado });
      adminHook.setSuccess('Estado del producto actualizado');
      adminHook.loadData();
      return true;
    } catch (err) {
      adminHook.setError(`Error al actualizar estado: ${err.message}`);
      return false;
    }
  }, [adminHook]);

  return {
    ...adminHook,
    productos: adminHook.data,
    updateEstado,
  };
};

/**
 * Hook específico para gestión de categorías
 */
export const useCategorias = () => {
  const adminHook = useAdmin('categorias');
  
  return {
    ...adminHook,
    categorias: adminHook.data,
  };
};

/**
 * Hook específico para gestión de pedidos
 */
export const usePedidos = () => {
  const adminHook = useAdmin('pedidos');
  
  // Función específica para actualizar estado de pedido
  const updateEstado = useCallback(async (id, estado) => {
    try {
      await pedidosAPI.updateEstado(id, estado);
      adminHook.setSuccess('Estado del pedido actualizado');
      adminHook.loadData();
      return true;
    } catch (err) {
      adminHook.setError(`Error al actualizar estado: ${err.message}`);
      return false;
    }
  }, [adminHook]);

  // Función específica para cancelar pedido
  const cancelar = useCallback(async (id) => {
    try {
      await pedidosAPI.cancelar(id);
      adminHook.setSuccess('Pedido cancelado exitosamente');
      adminHook.loadData();
      return true;
    } catch (err) {
      adminHook.setError(`Error al cancelar pedido: ${err.message}`);
      return false;
    }
  }, [adminHook]);

  return {
    ...adminHook,
    pedidos: adminHook.data,
    updateEstado,
    cancelar,
  };
};
