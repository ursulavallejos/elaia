/**
 * Rutas de Categorías para ELAIA E-commerce
 * 
 * Este archivo define todas las rutas relacionadas con categorías de productos.
 * Las categorías permiten organizar y filtrar productos de manera eficiente.
 * 
 * Estructura de Permisos:
 * - GET (listar/ver): Acceso público (sin autenticación)
 * - POST (crear): Solo administradores (verifyToken + verifyAdmin)
 * - PUT (actualizar): Solo administradores (verifyToken + verifyAdmin)
 * - DELETE (eliminar): Solo administradores (verifyToken + verifyAdmin)
 * 
 * Endpoints Disponibles:
 * - GET /categorias - Listar todas las categorías
 * - GET /categorias/:id - Obtener categoría específica con productos
 * - POST /categorias - Crear nueva categoría (admin)
 * - PUT /categorias/:id - Actualizar categoría (admin)
 * - DELETE /categorias/:id - Eliminar categoría (admin)
 * 
 * @author Equipo de Desarrollo ELAIA
 * @version 1.0.0
 */

import { Router } from "express";
import * as categoriaController from "../controllers/CategoriaController.js";
import { verifyToken } from "../middlewares/authMiddleware.js";
import { verifyAdmin } from "../middlewares/adminMiddleware.js";

const router = Router();

// =====================================================
// RUTAS PÚBLICAS (Sin autenticación requerida)
// =====================================================

/**
 * GET /categorias
 * Obtener lista de todas las categorías
 * 
 * Query Parameters:
 * - includeProducts: Si incluir productos asociados (true/false)
 * 
 * Esta ruta es útil para:
 * - Mostrar filtros de categorías en el frontend
 * - Navegación por categorías
 * - Listado de categorías en formularios
 */
router.get("/", categoriaController.getCategorias);

/**
 * GET /categorias/:id
 * Obtener detalles de una categoría específica
 * 
 * Incluye automáticamente todos los productos asociados a la categoría.
 * Útil para mostrar páginas de categoría con sus productos.
 */
router.get("/:id", categoriaController.getCategoriaById);

// =====================================================
// RUTAS ADMINISTRATIVAS (Requieren autenticación + permisos de admin)
// =====================================================

/**
 * POST /categorias
 * Crear una nueva categoría
 * 
 * Requiere: Token JWT válido + Rol de Administrador
 * 
 * Body Parameters:
 * - nombre: Nombre de la categoría (obligatorio, debe ser único)
 */
router.post("/", verifyToken, verifyAdmin, categoriaController.createCategoria);

/**
 * PUT /categorias/:id
 * Actualizar una categoría existente
 * 
 * Requiere: Token JWT válido + Rol de Administrador
 * 
 * Body Parameters:
 * - nombre: Nuevo nombre de la categoría (obligatorio, debe ser único)
 */
router.put("/:id", verifyToken, verifyAdmin, categoriaController.updateCategoria);

/**
 * DELETE /categorias/:id
 * Eliminar una categoría
 * 
 * Requiere: Token JWT válido + Rol de Administrador
 * 
 * Restricciones:
 * - No se puede eliminar una categoría que tenga productos asociados
 * - Se debe desasociar primero todos los productos antes de eliminar
 * 
 * Esta restricción protege la integridad de los datos y evita
 * que productos queden sin categoría accidentalmente.
 */
router.delete("/:id", verifyToken, verifyAdmin, categoriaController.deleteCategoria);

export default router;
