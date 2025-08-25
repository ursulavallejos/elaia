/**
 * Contexto de Autenticación para la Aplicación E-commerce ELAIA
 * 
 * Este archivo proporciona un sistema completo de autenticación usando React Context API.
 * Maneja el registro de usuarios, inicio de sesión, cierre de sesión y gestión del estado 
 * de autenticación en toda la aplicación.
 * 
 * Características Principales:
 * - Autenticación basada en tokens JWT
 * - Estado de login persistente usando localStorage
 * - Validación automática de tokens y restauración de usuario
 * - Manejo integral de errores
 * - Estados de carga para mejor UX
 * 
 * @author Equipo de Desarrollo ELAIA
 * @version 1.0.0
 */

import React, { createContext, useContext, useReducer, useEffect, useCallback } from 'react';
import axios from 'axios';
import { buildApiUrl } from '../config/api';

/**
 * React Context para gestionar el estado de autenticación en toda la aplicación.
 * Este contexto proporciona datos y métodos de autenticación a todos los componentes hijos.
 */
const AuthContext = createContext();

/**
 * Reductor de Estado de Autenticación
 * 
 * Este reductor gestiona todas las transiciones de estado de autenticación en la aplicación.
 * Sigue patrones estilo Redux para una gestión de estado predecible.
 * 
 * @param {Object} state - Estado actual de autenticación
 * @param {Object} action - Objeto acción con tipo y payload
 * @returns {Object} Nuevo estado de autenticación
 */
const authReducer = (state, action) => {
    switch (action.type) {
        // Se ejecuta cuando inicia el proceso de login/registro
        case 'LOGIN_START':
            return {
                ...state,
                loading: true,        // Mostrar spinner de carga
                error: null          // Limpiar errores previos
            };
        
        // Se ejecuta cuando el login/registro es exitoso
        case 'LOGIN_SUCCESS':
            return {
                ...state,
                loading: false,                    // Ocultar spinner de carga
                isAuthenticated: true,             // Marcar usuario como autenticado
                user: action.payload.user,         // Almacenar información del usuario
                token: action.payload.token,       // Almacenar token JWT
                error: null                        // Limpiar errores
            };
        
        // Se ejecuta cuando el login/registro falla
        case 'LOGIN_FAILURE':
            return {
                ...state,
                loading: false,                    // Ocultar spinner de carga
                isAuthenticated: false,            // Marcar usuario como no autenticado
                user: null,                        // Limpiar datos del usuario
                token: null,                       // Limpiar token
                error: action.payload              // Almacenar mensaje de error
            };
        
        // Se ejecuta cuando el usuario cierra sesión
        case 'LOGOUT':
            return {
                ...state,
                isAuthenticated: false,            // Marcar usuario como no autenticado
                user: null,                        // Limpiar datos del usuario
                token: null,                       // Limpiar token
                error: null                        // Limpiar errores
            };
        
        // Se ejecuta para limpiar mensajes de error (ej: cuando el usuario empieza a escribir)
        case 'CLEAR_ERROR':
            return {
                ...state,
                error: null                        // Limpiar mensaje de error
            };
        
        // Retorna el estado actual para acciones desconocidas
        default:
            return state;
    }
};

/**
 * Estado inicial de autenticación
 * Representa el estado por defecto cuando la aplicación se carga por primera vez
 */
const initialState = {
    isAuthenticated: false,      // Si el usuario está logueado
    user: null,                  // Información del usuario (id, email, rol)
    token: null,                 // Token de autenticación JWT
    loading: false,              // Si hay una operación de auth en progreso
    error: null                  // Mensajes de error de autenticación
};

/**
 * Componente AuthProvider
 * 
 * Este componente envuelve toda la aplicación y proporciona contexto de autenticación
 * a todos los componentes hijos. Gestiona el estado de autenticación y
 * proporciona métodos para login, registro, logout, etc.
 * 
 * @param {Object} props - Propiedades del componente
 * @param {React.ReactNode} props.children - Componentes hijos a envolver
 * @returns {JSX.Element} Componente provider con contexto de autenticación
 */
export function AuthProvider({ children }) {
    // Inicializar estado de autenticación usando el hook useReducer
    const [state, dispatch] = useReducer(authReducer, initialState);

    /**
     * Efecto para restaurar el estado de autenticación al cargar la app
     * 
     * Se ejecuta una vez cuando el componente se monta y verifica localStorage
     * en busca de datos de autenticación existentes. Si los encuentra, automáticamente
     * vuelve a loguear al usuario para mantener la persistencia de sesión.
     */
    useEffect(() => {
        const token = localStorage.getItem('authToken');
        const userData = localStorage.getItem('userData');
        
        // Si tanto el token como los datos del usuario existen en localStorage
        if (token && userData) {
            try {
                // Parsear los datos del usuario almacenados
                const user = JSON.parse(userData);
                
                // Restaurar estado de autenticación
                dispatch({
                    type: 'LOGIN_SUCCESS',
                    payload: { token, user }
                });
                
                // Establecer header de autorización por defecto para todas las peticiones API futuras
                // Esto asegura que todas las peticiones axios incluyan automáticamente el token de auth
                axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            } catch (error) {
                // Si el parsing falla, limpiar datos inválidos del localStorage
                console.error('Failed to parse stored user data:', error);
                localStorage.removeItem('authToken');
                localStorage.removeItem('userData');
            }
        }
    }, []);

    /**
     * Función de Login de Usuario
     * 
     * Autentica un usuario con email y contraseña, almacena el token JWT,
     * y actualiza el estado de autenticación de la aplicación.
     * 
     * @param {string} email - Dirección de email del usuario
     * @param {string} password - Contraseña del usuario
     * @returns {Promise<Object>} Objeto resultado con estado de éxito y mensaje de error si hay alguno
     */
    const login = useCallback(async (email, password) => {
        // Start login process (shows loading spinner)
        dispatch({ type: 'LOGIN_START' });
        
        try {
            // Make API request to backend authentication endpoint
            const response = await axios.post(buildApiUrl('/auth/login'), {
                email,
                password
            });

            // Extract JWT token and user information from response
            const { token, user } = response.data;
            
            // Validate that we received both token and user data
            if (!token || !user) {
                throw new Error('Respuesta de login incompleta del servidor');
            }

            // Persist authentication data in browser's localStorage
            // This allows the user to remain logged in even after browser refresh
            localStorage.setItem('authToken', token);
            localStorage.setItem('userData', JSON.stringify(user));
            
            // Set default authorization header for all future axios requests
            // This automatically includes the token in API calls
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

            // Update application state to reflect successful login
            dispatch({
                type: 'LOGIN_SUCCESS',
                payload: { token, user }
            });

            // Return success result
            return { success: true };
        } catch (error) {
            // Extract error message from API response or use default
            const errorMessage = error.response?.data?.message || 'Error en el login';
            
            // Update state to reflect login failure
            dispatch({
                type: 'LOGIN_FAILURE',
                payload: errorMessage
            });
            
            // Return failure result with error message
            return { success: false, error: errorMessage };
        }
    }, []); // No dependencies needed since it only uses dispatch

    /**
     * User Registration Function
     * 
     * Creates a new user account and automatically logs them in upon successful registration.
     * Assigns a default customer role (id_rol: 2) to new users.
     * 
     * @param {Object} userData - User registration data
     * @param {string} userData.nombre - User's first name
     * @param {string} userData.apellido - User's last name
     * @param {string} userData.email - User's email address
     * @param {string} userData.password - User's password
     * @returns {Promise<Object>} Result object with success status and error message if any
     */
    const register = useCallback(async (userData) => {
        // Start registration process (shows loading spinner)
        dispatch({ type: 'LOGIN_START' });
        
        try {
            // Make API request to backend registration endpoint
            // Automatically assign customer role (id_rol: 2) to new users
            const response = await axios.post(buildApiUrl('/auth/register'), {
                ...userData,
                id_rol: 2 // Default role: 2 = customer, 1 = admin (assumed)
            });

            // After successful registration, automatically log the user in
            // This provides a seamless user experience
            return await login(userData.email, userData.password);
        } catch (error) {
            // Extract error message from API response or use default
            const errorMessage = error.response?.data?.message || 'Error en el registro';
            
            // Update state to reflect registration failure
            dispatch({
                type: 'LOGIN_FAILURE',
                payload: errorMessage
            });
            
            // Return failure result with error message
            return { success: false, error: errorMessage };
        }
    }, [login]); // Depends on login function

    /**
     * User Logout Function
     * 
     * Clears all authentication data from the application and browser storage.
     * This includes removing the JWT token, user data, and authorization headers.
     */
    const logout = useCallback(() => {
        // Remove authentication data from localStorage
        localStorage.removeItem('authToken');
        localStorage.removeItem('userData');
        
        // Remove authorization header from future axios requests
        delete axios.defaults.headers.common['Authorization'];
        
        // Update application state to reflect logout
        dispatch({ type: 'LOGOUT' });
    }, []); // No dependencies needed

    /**
     * Clear Error Function
     * 
     * Clears any authentication error messages from the state.
     * Typically called when user starts interacting with forms after an error.
     */
    const clearError = useCallback(() => {
        dispatch({ type: 'CLEAR_ERROR' });
    }, []); // No dependencies needed

    /**
     * Verificar si el usuario actual es administrador
     * @returns {boolean} True si el usuario es administrador
     */
    const isAdmin = useCallback(() => {
        return state.isAuthenticated && state.user && state.user.rol === 'Administrador';
    }, [state.isAuthenticated, state.user]);

    /**
     * Verificar si el usuario actual es cliente
     * @returns {boolean} True si el usuario es cliente
     */
    const isCliente = useCallback(() => {
        return state.isAuthenticated && state.user && state.user.rol === 'Cliente';
    }, [state.isAuthenticated, state.user]);

    /**
     * Obtener el rol del usuario actual
     * @returns {string|null} 'Administrador', 'Cliente' o null
     */
    const getUserRole = useCallback(() => {
        return state.isAuthenticated && state.user ? state.user.rol : null;
    }, [state.isAuthenticated, state.user]);

    /**
     * Context value object containing all authentication state and methods
     * This is what gets provided to all child components through the context
     */
    const value = {
        // Spread all state properties (isAuthenticated, user, token, loading, error)
        ...state,
        
        // Authentication methods
        login,          // Function to log in a user
        register,       // Function to register a new user
        logout,         // Function to log out the current user
        clearError,     // Function to clear error messages
        
        // Role checking utilities
        isAdmin,        // Function to check if user is admin
        isCliente,      // Function to check if user is client
        getUserRole     // Function to get current user role
    };

    // Provide the authentication context to all child components
    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}

/**
 * Custom Hook for Using Authentication Context
 * 
 * This hook provides a convenient way for components to access the authentication
 * context. It includes error checking to ensure the hook is used within an AuthProvider.
 * 
 * @returns {Object} Authentication context value with state and methods
 * @throws {Error} If used outside of an AuthProvider
 * 
 * @example
 * function MyComponent() {
 *     const { isAuthenticated, user, login, logout } = useAuth();
 *     
 *     if (isAuthenticated) {
 *         return <div>Welcome, {user.email}!</div>;
 *     }
 *     
 *     return <LoginForm onLogin={login} />;
 * }
 */
export function useAuth() {
    const context = useContext(AuthContext);
    
    // Ensure the hook is used within an AuthProvider
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    
    return context;
}
