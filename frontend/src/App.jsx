/**
 * Componente Principal de la Aplicación E-commerce ELAIA
 * 
 * Este es el componente raíz de la aplicación e-commerce ELAIA. Configura
 * la estructura de la aplicación, enrutamiento y gestión de estado global
 * a través de providers de React Context.
 * 
 * Arquitectura de la Aplicación:
 * - React Router para enrutamiento del lado del cliente
 * - Context API para gestión de estado global (Auth & Cart)
 * - Bootstrap para estilos de UI
 * - Arquitectura basada en componentes
 * 
 * Características Principales:
 * - Autenticación de usuarios con login persistente
 * - Funcionalidad de carrito de compras
 * - Catálogo de productos con categorías (Batas, Cosmetiqueros)
 * - Gestión de perfil de usuario
 * - Cumplimiento de páginas legales
 * - Funcionalidad de búsqueda
 * 
 * Providers de Contexto:
 * - AuthProvider: Gestiona estado de autenticación de usuario
 * - CartProvider: Gestiona estado del carrito de compras
 * 
 * @author Equipo de Desarrollo ELAIA
 * @version 1.0.0
 */

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout.jsx';
import { CartProvider } from './context/CartContext.jsx';
import { AuthProvider } from './context/AuthContext.jsx';
import './App.css';

// Páginas principales de la aplicación
import Home from './pages/Home.jsx';                    // Página principal con productos destacados
import Login from './pages/Login.jsx';                  // Formulario de login de usuario
import Register from './pages/Register.jsx';            // Formulario de registro de usuario
import Profile from './pages/Profile.jsx';              // Gestión de perfil de usuario
import MisPedidos from './pages/MisPedidos.jsx';        // Historial de pedidos del usuario

// Páginas de categorías de productos
import Batas from './pages/Batas.jsx';                  // Catálogo de productos Batas
import Cosmetiqueros from './pages/Cosmetiqueros.jsx';  // Catálogo de productos Cosmetiqueros
import SobreElaia from './pages/SobreElaia.jsx';        // Página acerca de nosotros
import Buscar from './pages/Buscar.jsx';                // Página de resultados de búsqueda
import Carrito from './pages/Carrito.jsx';              // Página del carrito de compras

// Páginas de cumplimiento legal
import TerminosCondiciones from './pages/TerminosCondiciones.jsx';    // Términos y condiciones
import PoliticasCambio from './pages/PoliticasCambio.jsx';            // Política de devoluciones/cambios

// Páginas de administración
import Dashboard from './pages/admin/Dashboard.jsx';                   // Panel principal de administración
import Usuarios from './pages/admin/Usuarios.jsx';                    // Gestión de usuarios
import Roles from './pages/admin/Roles.jsx';                          // Gestión de roles
import Productos from './pages/admin/Productos.jsx';                  // Gestión de productos
import Categorias from './pages/admin/Categorias.jsx';                // Gestión de categorías
import Pedidos from './pages/admin/Pedidos.jsx';                      // Gestión de pedidos

/**
 * Componente Principal de la App
 * 
 * Este componente sirve como la raíz de la aplicación y configura la estructura
 * fundamental de la app e-commerce ELAIA. Establece la jerarquía de providers
 * para gestión de estado global y define todas las rutas de la aplicación.
 * 
 * Jerarquía de Providers (del más externo al más interno):
 * 1. AuthProvider - Proporciona estado y métodos de autenticación globalmente
 * 2. CartProvider - Proporciona estado y métodos del carrito globalmente
 * 3. Router - Habilita enrutamiento del lado del cliente en toda la app
 * 
 * @returns {JSX.Element} El árbol completo de componentes de la aplicación
 */
function App() {
  return (
    // Authentication Provider - Must be outermost to provide auth context to cart
    // and all other components that might need user information
    <AuthProvider>
      {/* Shopping Cart Provider - Provides cart functionality to all components */}
      <CartProvider>
        {/* React Router - Enables single-page application routing */}
        <Router>
          {/* Application Routes - Defines URL structure and page components */}
          <Routes>
            {/* Main application routes with Layout */}
            <Route path="/" element={<Layout><Home /></Layout>} />                    {/* Landing/home page */}
            
            {/* Product category routes with Layout */}
            <Route path="/batas" element={<Layout><Batas /></Layout>} />              {/* Batas product listing */}
            <Route path="/cosmetiqueros" element={<Layout><Cosmetiqueros /></Layout>} /> {/* Cosmetiqueros product listing */}
            
            {/* Utility and information routes with Layout */}
            <Route path="/sobre-elaia" element={<Layout><SobreElaia /></Layout>} />   {/* About us page */}
            <Route path="/buscar" element={<Layout><Buscar /></Layout>} />            {/* Search results */}
            <Route path="/carrito" element={<Layout><Carrito /></Layout>} />          {/* Shopping cart */}
            
            {/* Authentication routes with Layout */}
            <Route path="/login" element={<Layout><Login /></Layout>} />              {/* User login */}
            <Route path="/registro" element={<Layout><Register /></Layout>} />        {/* User registration */}
            <Route path="/perfil" element={<Layout><Profile /></Layout>} />           {/* User profile */}
            <Route path="/mis-pedidos" element={<Layout><MisPedidos /></Layout>} />   {/* User orders history */}
            
            {/* Legal compliance routes - Already have their own navbar */}
            <Route path="/terminos-condiciones" element={<TerminosCondiciones />} />    {/* Terms of service */}
            <Route path="/politicas-cambio" element={<PoliticasCambio />} />            {/* Return policy */}
            
            {/* Administrative routes - Protected by role-based access control */}
            <Route path="/admin" element={<Dashboard />} />                             {/* Admin dashboard */}
            <Route path="/admin/usuarios" element={<Usuarios />} />                     {/* User management */} 
            <Route path="/admin/roles" element={<Roles />} />                           {/* Role management */}
            <Route path="/admin/productos" element={<Productos />} />                   {/* Product management */}
            <Route path="/admin/categorias" element={<Categorias />} />                 {/* Category management */}
            <Route path="/admin/pedidos" element={<Pedidos />} />                       {/* Order management */}
          </Routes>
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
