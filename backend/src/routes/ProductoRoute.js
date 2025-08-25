/**
 * Rutas de Productos para ELAIA E-commerce
 * 
 * Este archivo define todas las rutas relacionadas con productos.
 * Implementa diferentes niveles de acceso según la operación y el rol del usuario.
 * 
 * Estructura de Permisos:
 * - GET (listar/ver): Acceso público (sin autenticación)
 * - POST (crear): Solo administradores (verifyToken + verifyAdmin)
 * - PUT (actualizar): Solo administradores (verifyToken + verifyAdmin)
 * - DELETE (eliminar): Solo administradores (verifyToken + verifyAdmin)
 * 
 * Endpoints Disponibles:
 * - GET /productos - Listar productos con filtros opcionales
 * - GET /productos/:id - Obtener producto específico
 * - POST /productos - Crear nuevo producto (admin)
 * - PUT /productos/:id - Actualizar producto (admin)
 * - DELETE /productos/:id - Eliminar producto (admin)
 * 
 * @author Equipo de Desarrollo ELAIA
 * @version 1.0.0
 */

import { Router } from "express";
import * as productoController from "../controllers/ProductoController.js";
import { verifyToken } from "../middlewares/authMiddleware.js";
import { verifyAdmin } from "../middlewares/adminMiddleware.js";

const router = Router();

// =====================================================
// RUTAS PÚBLICAS (Sin autenticación requerida)
// =====================================================

/**
 * GET /productos
 * Obtener lista de productos con filtros opcionales
 * 
 * Query Parameters:
 * - categoria: Filtrar por nombre de categoría
 * - search: Buscar en nombre y descripción
 * - limit: Límite de resultados
 * - offset: Desplazamiento para paginación
 */
router.get("/", productoController.getProductos);

/**
 * GET /productos/:id
 * Obtener detalles de un producto específico
 * Incluye información de categorías asociadas
 */
router.get("/:id", productoController.getProductoById);

// =====================================================
// RUTAS ADMINISTRATIVAS (Requieren autenticación + permisos de admin)
// =====================================================

/**
 * POST /productos
 * Crear un nuevo producto
 * 
 * Requiere: Token JWT válido + Rol de Administrador
 * 
 * Body Parameters:
 * - nombre: Nombre del producto (obligatorio)
 * - descripcion: Descripción del producto (opcional)
 * - precio: Precio del producto (obligatorio)
 * - imagen_url: URL de imagen (opcional)
 * - categorias: Array de IDs de categorías (opcional)
 */
router.post("/", verifyToken, verifyAdmin, productoController.createProducto);

/**
 * PUT /productos/:id
 * Actualizar un producto existente
 * 
 * Requiere: Token JWT válido + Rol de Administrador
 * 
 * Body Parameters: (todos opcionales, solo se actualizan los campos enviados)
 * - nombre: Nuevo nombre del producto
 * - descripcion: Nueva descripción
 * - precio: Nuevo precio
 * - imagen_url: Nueva URL de imagen
 * - categorias: Nuevo array de IDs de categorías
 */
router.put("/:id", verifyToken, verifyAdmin, productoController.updateProducto);

/**
 * DELETE /productos/:id
 * Eliminar un producto
 * 
 * Requiere: Token JWT válido + Rol de Administrador
 * 
 * Nota: Esta operación eliminará automáticamente todas las relaciones
 * del producto con categorías debido a las restricciones CASCADE en la BD.
 */
router.delete("/:id", verifyToken, verifyAdmin, productoController.deleteProducto);

export default router;
