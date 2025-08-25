/**
 * Rutas de Pedidos para ELAIA E-commerce
 * 
 * Este archivo define todas las rutas relacionadas con pedidos de usuarios.
 * Los pedidos representan las compras realizadas por los clientes.
 * 
 * Estructura de Permisos:
 * - Todas las rutas requieren autenticación (verifyToken)
 * - Los usuarios solo pueden ver/gestionar sus propios pedidos
 * - Los administradores pueden ver/gestionar todos los pedidos
 * - Solo administradores pueden actualizar estados de pedidos
 * 
 * Endpoints Disponibles:
 * - GET /pedidos - Listar pedidos (propios o todos según rol)
 * - GET /pedidos/:id - Obtener pedido específico
 * - POST /pedidos - Crear nuevo pedido
 * - PUT /pedidos/:id/estado - Actualizar estado de pedido (admin)
 * - DELETE /pedidos/:id - Cancelar pedido
 * 
 * @author Equipo de Desarrollo ELAIA
 * @version 1.0.0
 */

import { Router } from "express";
import * as pedidoController from "../controllers/PedidoController.js";
import { verifyToken } from "../middlewares/authMiddleware.js";
import { verifyAdmin } from "../middlewares/adminMiddleware.js";

const router = Router();

// =====================================================
// RUTAS PARA USUARIOS AUTENTICADOS
// =====================================================

/**
 * GET /pedidos
 * Obtener lista de pedidos
 * 
 * Comportamiento según rol:
 * - Usuario normal: Solo ve sus propios pedidos
 * - Administrador: Ve todos los pedidos con filtros opcionales
 * 
 * Query Parameters:
 * - estado: Filtrar por estado (pendiente, procesando, enviado, entregado, cancelado)
 * - userId: (Solo admin) Filtrar por ID de usuario específico
 * - limit: Límite de resultados para paginación
 * - offset: Desplazamiento para paginación
 * 
 * Requiere: Token JWT válido
 */
router.get("/", verifyToken, pedidoController.getPedidos);

/**
 * GET /pedidos/usuario/:userId
 * Obtener pedidos de un usuario específico
 * 
 * Comportamiento según rol:
 * - Usuario normal: Solo puede ver sus propios pedidos (si userId coincide con su ID)
 * - Administrador: Puede ver pedidos de cualquier usuario
 * 
 * Requiere: Token JWT válido
 */
router.get("/usuario/:userId", verifyToken, pedidoController.getPedidos);

/**
 * GET /pedidos/:id
 * Obtener detalles de un pedido específico
 * 
 * Comportamiento según rol:
 * - Usuario normal: Solo puede ver sus propios pedidos
 * - Administrador: Puede ver cualquier pedido
 * 
 * Incluye información completa del pedido:
 * - Datos del usuario que realizó el pedido
 * - Lista de productos con detalles
 * - Personalizaciones aplicadas (si las hay)
 * 
 * Requiere: Token JWT válido
 */
router.get("/:id", verifyToken, pedidoController.getPedidoById);

/**
 * POST /pedidos
 * Crear un nuevo pedido
 * 
 * Permite a cualquier usuario autenticado crear un pedido.
 * El pedido se asocia automáticamente al usuario que lo crea.
 * 
 * Body Parameters:
 * - productos: Array de productos del pedido (obligatorio)
 *   - id: ID del producto (obligatorio)
 *   - nombre_personalizado: Personalización del producto (opcional)
 * - estado: Estado inicial del pedido (opcional, default: "pendiente")
 * 
 * Requiere: Token JWT válido
 */
router.post("/", verifyToken, pedidoController.createPedido);

// =====================================================
// RUTAS ADMINISTRATIVAS
// =====================================================



// =====================================================
// RUTAS CON LÓGICA MIXTA DE PERMISOS
// =====================================================

/**
 * DELETE /pedidos/:id
 * Eliminar un pedido
 * 
 * Comportamiento según rol:
 * - Usuario normal: Solo puede eliminar sus propios pedidos
 * - Administrador: Puede eliminar cualquier pedido
 * 
 * La eliminación borra el pedido de la base de datos permanentemente.
 * 
 * Requiere: Token JWT válido
 */
router.delete("/:id", verifyToken, pedidoController.deletePedido);

export default router;
