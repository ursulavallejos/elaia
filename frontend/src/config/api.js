/**
 * Configuración centralizada de la API para ELAIA E-commerce
 * 
 * Este archivo contiene toda la configuración de la API del backend.
 * Simplifica el manejo de URLs y proporciona utilidades comunes.
 * 
 * @author Equipo de Desarrollo ELAIA
 * @version 1.0.0
 */

// URL base de la API
// En Vite, las variables de entorno deben usar import.meta.env en lugar de process.env
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000/api';

// Función helper para construir URLs completas
export const buildApiUrl = (endpoint) => {
  return `${API_BASE_URL}${endpoint}`;
};

// Headers por defecto para peticiones
export const DEFAULT_HEADERS = {
  'Content-Type': 'application/json',
};

// Función helper para obtener headers con token
export const getAuthHeaders = () => {
  const token = localStorage.getItem('authToken');
  return {
    ...DEFAULT_HEADERS,
    ...(token && { 'Authorization': `Bearer ${token}` }),
  };
};

// Función helper para hacer peticiones HTTP simples
export const apiRequest = async (endpoint, options = {}) => {
  const config = {
    headers: getAuthHeaders(),
    ...options,
  };

  try {
    const response = await fetch(buildApiUrl(endpoint), config);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP Error: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error(`API Request Error (${endpoint}):`, error);
    throw error;
  }
};

// =====================================================
// SERVICIOS DE API PARA ADMINISTRACIÓN
// =====================================================

// Servicios de autenticación
export const authAPI = {
  login: async (credentials) => {
    return apiRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  },
  register: async (userData) => {
    return apiRequest('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  },
};

// Servicios de usuarios
export const usuariosAPI = {
  getAll: () => apiRequest('/usuarios'),
  getById: (id) => apiRequest(`/usuarios/${id}`),
  create: (userData) => apiRequest('/usuarios', {
    method: 'POST',
    body: JSON.stringify(userData),
  }),
  update: (id, userData) => apiRequest(`/usuarios/${id}`, {
    method: 'PUT',
    body: JSON.stringify(userData),
  }),
  delete: (id) => apiRequest(`/usuarios/${id}`, {
    method: 'DELETE',
  }),
};

// Servicios de roles
export const rolesAPI = {
  getAll: () => apiRequest('/roles'),
  getById: (id) => apiRequest(`/roles/${id}`),
  create: (rolData) => apiRequest('/roles', {
    method: 'POST',
    body: JSON.stringify(rolData),
  }),
  update: (id, rolData) => apiRequest(`/roles/${id}`, {
    method: 'PUT',
    body: JSON.stringify(rolData),
  }),
  delete: (id) => apiRequest(`/roles/${id}`, {
    method: 'DELETE',
  }),
};

// Servicios de productos
export const productosAPI = {
  getAll: (filters = {}) => {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        params.append(key, value);
      }
    });
    const queryString = params.toString();
    return apiRequest(`/productos${queryString ? `?${queryString}` : ''}`);
  },
  getById: (id) => apiRequest(`/productos/${id}`),
  create: (productData) => apiRequest('/productos', {
    method: 'POST',
    body: JSON.stringify(productData),
  }),
  update: (id, productData) => apiRequest(`/productos/${id}`, {
    method: 'PUT',
    body: JSON.stringify(productData),
  }),
  delete: (id) => apiRequest(`/productos/${id}`, {
    method: 'DELETE',
  }),
};

// Servicios de categorías
export const categoriasAPI = {
  getAll: (includeProducts = false) => {
    return apiRequest(`/categorias${includeProducts ? '?includeProducts=true' : ''}`);
  },
  getById: (id) => apiRequest(`/categorias/${id}`),
  create: (categoriaData) => apiRequest('/categorias', {
    method: 'POST',
    body: JSON.stringify(categoriaData),
  }),
  update: (id, categoriaData) => apiRequest(`/categorias/${id}`, {
    method: 'PUT',
    body: JSON.stringify(categoriaData),
  }),
  delete: (id) => apiRequest(`/categorias/${id}`, {
    method: 'DELETE',
  }),
};

// Servicios de pedidos
export const pedidosAPI = {
  getAll: (filters = {}) => {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        params.append(key, value);
      }
    });
    const queryString = params.toString();
    return apiRequest(`/pedidos${queryString ? `?${queryString}` : ''}`);
  },
  getById: (id) => apiRequest(`/pedidos/${id}`),
  create: (pedidoData) => apiRequest('/pedidos', {
    method: 'POST',
    body: JSON.stringify(pedidoData),
  }),
  updateEstado: (id, estado) => apiRequest(`/pedidos/${id}/estado`, {
    method: 'PUT',
    body: JSON.stringify({ estado }),
  }),
  cancelar: (id) => apiRequest(`/pedidos/${id}`, {
    method: 'DELETE',
  }),
  delete: (id) => apiRequest(`/pedidos/${id}`, {
    method: 'DELETE',
  }),
};

// =====================================================
// UTILIDADES
// =====================================================

/**
 * Verificar si el usuario actual es administrador
 */
export const isAdmin = () => {
  const token = localStorage.getItem('authToken');
  if (!token) return false;
  
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.rol === 'Administrador';
  } catch (error) {
    return false;
  }
};

/**
 * Obtener datos del usuario actual del token
 */
export const getCurrentUser = () => {
  const token = localStorage.getItem('authToken');
  if (!token) return null;
  
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return {
      id: payload.id,
      email: payload.email,
      rol: payload.rol,
    };
  } catch (error) {
    return null;
  }
};

/**
 * Verificar si el token está expirado
 */
export const isTokenExpired = () => {
  const token = localStorage.getItem('authToken');
  if (!token) return true;
  
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return Date.now() >= payload.exp * 1000;
  } catch (error) {
    return true;
  }
};
