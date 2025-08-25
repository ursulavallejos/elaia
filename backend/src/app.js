/**
 * Aplicación Backend E-commerce ELAIA
 * 
 * Este es el archivo principal de la aplicación Express.js para el backend de ELAIA e-commerce.
 * Configura el servidor, middleware y rutas API.
 * 
 * Características Principales:
 * - Framework web Express.js
 * - CORS habilitado para peticiones cross-origin (comunicación frontend)
 * - Parsing de cuerpo JSON para peticiones API
 * - Organización modular de rutas
 * - Estructura API RESTful
 * 
 * Endpoints API:
 * - /auth/* - Rutas de autenticación (login, registro)
 * - /usuarios/* - Rutas de gestión de usuarios
 * - /roles/* - Rutas de gestión de roles de usuario
 * - /productos/* - Rutas de productos (CRUD con restricciones admin)
 * - /categorias/* - Rutas de categorías (CRUD con restricciones admin)
 * - /pedidos/* - Rutas de pedidos (usuarios autenticados)
 * 
 * @author Equipo de Desarrollo ELAIA
 * @version 1.0.0
 */

import express from "express";
import cors from "cors";
import usuariosRoutes from "./routes/UsuarioRoute.js";
import rolesRoutes from "./routes/RolRoute.js";
import authRoutes from "./routes/AuthRoute.js";
import productosRoutes from "./routes/ProductoRoute.js";
import categoriasRoutes from "./routes/CategoriaRoute.js";
import pedidosRoutes from "./routes/PedidoRoute.js";

// Crear instancia de aplicación Express
const app = express();

// Configuración de Middleware

// Habilitar CORS (Cross-Origin Resource Sharing)
// Esto permite que el frontend (ejecutándose en puerto diferente) se comunique con el backend
app.use(cors());

// Parsear cuerpos de petición JSON
// Este middleware parsea payloads JSON entrantes y los hace disponibles en req.body
app.use(express.json());

// Configuración de Rutas API

// Rutas de autenticación - maneja login, registro y gestión de tokens JWT
app.use("/api/auth", authRoutes);

// Rutas de gestión de usuarios - operaciones CRUD para usuarios
app.use("/api/usuarios", usuariosRoutes);

// Rutas de gestión de roles - operaciones CRUD para roles de usuario
app.use("/api/roles", rolesRoutes);

// Rutas de productos - operaciones CRUD con restricciones de administrador
app.use("/api/productos", productosRoutes);

// Rutas de categorías - operaciones CRUD con restricciones de administrador
app.use("/api/categorias", categoriasRoutes);

// Rutas de pedidos - gestión de pedidos para usuarios autenticados
app.use("/api/pedidos", pedidosRoutes);

export default app;