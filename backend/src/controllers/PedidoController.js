/**
 * Controlador de Pedidos para ELAIA E-commerce
 * 
 * Este controlador maneja todas las operaciones relacionadas con pedidos de usuarios.
 * Los pedidos representan las compras realizadas por los clientes en la plataforma.
 * 
 * Características Principales:
 * - Creación de pedidos por usuarios autenticados
 * - Consulta de pedidos propios (usuarios) y todos los pedidos (administradores)
 * - Actualización de estado de pedidos (solo administradores)
 * - Gestión de detalles de pedidos con productos y personalizaciones
 * - Estados de pedido: pendiente, procesando, enviado, entregado, cancelado
 * 
 * Permisos de Acceso:
 * - POST (crear pedido): Usuarios autenticados
 * - GET (ver pedidos propios): Usuarios autenticados
 * - GET (ver todos los pedidos): Solo administradores
 * - PUT (actualizar estado): Solo administradores
 * - DELETE (cancelar): Usuario propietario o administrador
 * 
 * @author Equipo de Desarrollo ELAIA
 * @version 1.0.0
 */

import { Pedido, DetallePedido, Usuario, Producto } from "../models/index.js";
import { Op } from "sequelize";

/**
 * Obtener pedidos (con filtros según rol del usuario)
 * 
 * Los usuarios normales solo ven sus propios pedidos.
 * Los administradores pueden ver todos los pedidos con filtros opcionales.
 * 
 * @param {Object} req - Objeto request de Express
 * @param {Object} req.user - Datos del usuario autenticado (del middleware)
 * @param {Object} req.query - Parámetros de consulta opcionales
 * @param {string} req.query.estado - Filtrar por estado del pedido
 * @param {string} req.query.userId - (Solo admin) Filtrar por ID de usuario
 * @param {number} req.query.limit - Límite de resultados
 * @param {number} req.query.offset - Desplazamiento para paginación
 * @param {Object} res - Objeto response de Express
 * @returns {Object} JSON response con lista de pedidos
 */
export const getPedidos = async (req, res) => {
  try {
    const { limit, offset } = req.query;
    const { userId: userIdParam } = req.params; // ID de usuario desde URL
    const { userId: userIdQuery } = req.query; // ID de usuario desde query
    const isAdmin = req.user.rol === "Administrador";
    
    const queryOptions = {
      include: [
        {
          model: Usuario,
          attributes: ["id", "nombre", "apellido", "email"]
        },
        {
          model: DetallePedido,
          include: [{
            model: Producto,
            attributes: ["id", "nombre", "precio", "imagen_url"]
          }],
          attributes: ["id", "cantidad", "precio_unitario"]
        }
      ],
      order: [['fecha', 'DESC']]
    };

    // Configurar filtros WHERE
    const whereConditions = {};

    // Determinar qué ID de usuario usar (prioridad: URL param > query param > usuario actual)
    const targetUserId = userIdParam || userIdQuery;

    // Si no es admin, solo mostrar sus propios pedidos
    if (!isAdmin) {
      // Si especifica un userId diferente al suyo, denegar acceso
      if (targetUserId && parseInt(targetUserId) !== req.user.id) {
        return res.status(403).json({ 
          message: "No tienes permisos para ver los pedidos de otro usuario" 
        });
      }
      whereConditions.id_usuario = req.user.id;
    } else {
      // Si es admin y se especifica un usuario, filtrar por ese usuario
      if (targetUserId) {
        whereConditions.id_usuario = targetUserId;
      }
    }



    if (Object.keys(whereConditions).length > 0) {
      queryOptions.where = whereConditions;
    }

    // Paginación
    if (limit) {
      queryOptions.limit = parseInt(limit);
    }
    if (offset) {
      queryOptions.offset = parseInt(offset);
    }

    const pedidos = await Pedido.findAndCountAll(queryOptions);

    // Calcular total dinámicamente para cada pedido
    const pedidosConTotal = pedidos.rows.map(pedido => {
      const pedidoData = pedido.toJSON();
      const total = pedidoData.DetallePedidos?.reduce((sum, detalle) => {
        return sum + (detalle.cantidad * detalle.precio_unitario);
      }, 0) || 0;
      
      return {
        ...pedidoData,
        total: parseFloat(total.toFixed(2))
      };
    });

    res.json({
      pedidos: pedidosConTotal,
      total: pedidos.count,
      filtros: {
        userId: isAdmin ? targetUserId : req.user.id,
        limit: limit ? parseInt(limit) : null,
        offset: offset ? parseInt(offset) : 0
      }
    });
  } catch (error) {
    console.error("Error al obtener pedidos:", error);
    res.status(500).json({ message: "Error al obtener pedidos" });
  }
};

/**
 * Obtener un pedido por ID
 * 
 * Los usuarios solo pueden ver sus propios pedidos.
 * Los administradores pueden ver cualquier pedido.
 * 
 * @param {Object} req - Objeto request de Express
 * @param {string} req.params.id - ID del pedido a obtener
 * @param {Object} req.user - Datos del usuario autenticado
 * @param {Object} res - Objeto response de Express
 * @returns {Object} JSON response con datos del pedido o error 404/403
 */
export const getPedidoById = async (req, res) => {
  try {
    const isAdmin = req.user.rol === "Administrador";
    
    const whereCondition = { id: req.params.id };
    
    // Si no es admin, solo puede ver sus propios pedidos
    if (!isAdmin) {
      whereCondition.id_usuario = req.user.id;
    }

    const pedido = await Pedido.findOne({
      where: whereCondition,
      include: [
        {
          model: Usuario,
          attributes: ["id", "nombre", "apellido", "email"]
        },
        {
          model: Producto,
          through: {
            model: DetallePedido,
            attributes: ["nombre_personalizado"]
          },
          attributes: ["id", "nombre", "descripcion", "precio", "imagen_url"]
        }
      ]
    });

    if (!pedido) {
      return res.status(404).json({ 
        message: "Pedido no encontrado o no tienes permisos para verlo" 
      });
    }

    // Calcular total dinámicamente
    const pedidoData = pedido.toJSON();
    const total = pedidoData.Productos?.reduce((sum, producto) => {
      const detalle = producto.DetallePedido;
      return sum + (detalle?.cantidad || 0) * (detalle?.precio_unitario || 0);
    }, 0) || 0;

    res.json({
      ...pedidoData,
      total: parseFloat(total.toFixed(2))
    });
  } catch (error) {
    console.error("Error al obtener pedido:", error);
    res.status(500).json({ message: "Error al obtener pedido" });
  }
};

/**
 * Crear un nuevo pedido
 * 
 * Permite a los usuarios autenticados crear un nuevo pedido.
 * El pedido incluye productos y opcionalmente personalizaciones.
 * 
 * @param {Object} req - Objeto request de Express
 * @param {Object} req.user - Datos del usuario autenticado
 * @param {Object} req.body - Datos del pedido a crear
 * @param {Array} req.body.productos - Lista de productos del pedido
 * @param {number} req.body.productos[].id - ID del producto
 * @param {string} req.body.productos[].nombre_personalizado - Personalización (opcional)
 * @param {string} req.body.estado - Estado inicial del pedido (opcional, por defecto: "pendiente")
 * @param {Object} res - Objeto response de Express
 * @returns {Object} JSON response con pedido creado
 */
export const createPedido = async (req, res) => {
  try {
    const { productos } = req.body;

    // Validar que se proporcionen productos
    if (!productos || !Array.isArray(productos) || productos.length === 0) {
      return res.status(400).json({ 
        message: "Debe proporcionar al menos un producto para el pedido" 
      });
    }

    // Validar que todos los productos existan
    const productosIds = productos.map(p => p.id);
    const productosExistentes = await Producto.findAll({
      where: { id: productosIds }
    });

    if (productosExistentes.length !== productosIds.length) {
      return res.status(400).json({ 
        message: "Uno o más productos no existen" 
      });
    }

    // Crear el pedido
    const nuevoPedido = await Pedido.create({
      fecha: new Date(),
      id_usuario: req.user.id
    });

    // Crear los detalles del pedido
    const detallesPedido = productos.map(producto => ({
      id_pedido: nuevoPedido.id,
      id_producto: producto.id,
      cantidad: producto.cantidad || 1,
      precio_unitario: producto.precio_unitario || 0
    }));

    await DetallePedido.bulkCreate(detallesPedido);

    // Obtener el pedido completo con sus relaciones
    const pedidoCompleto = await Pedido.findByPk(nuevoPedido.id, {
      include: [
        {
          model: Usuario,
          attributes: ["id", "nombre", "apellido", "email"]
        },
        {
          model: DetallePedido,
          include: [{
            model: Producto,
            attributes: ["id", "nombre", "precio", "imagen_url"]
          }],
          attributes: ["id", "cantidad", "precio_unitario"]
        }
      ]
    });

    // Calcular total dinámicamente
    const pedidoData = pedidoCompleto.toJSON();
    const total = pedidoData.DetallePedidos?.reduce((sum, detalle) => {
      return sum + (detalle.cantidad * detalle.precio_unitario);
    }, 0) || 0;

    res.status(201).json({
      message: "Pedido creado exitosamente",
      pedido: {
        ...pedidoData,
        total: parseFloat(total.toFixed(2))
      }
    });
  } catch (error) {
    console.error("Error al crear pedido:", error);
    res.status(500).json({ message: "Error al crear pedido" });
  }
};



/**
 * Eliminar un pedido (Solo Administradores)
 * 
 * Permite a los administradores eliminar pedidos del sistema.
 * Los usuarios pueden eliminar sus propios pedidos.
 * 
 * @param {Object} req - Objeto request de Express
 * @param {string} req.params.id - ID del pedido a eliminar
 * @param {Object} req.user - Datos del usuario autenticado
 * @param {Object} res - Objeto response de Express
 * @returns {Object} JSON response confirmando eliminación
 */
export const deletePedido = async (req, res) => {
  try {
    const isAdmin = req.user.rol === "Administrador";
    
    const whereCondition = { id: req.params.id };
    
    // Si no es admin, solo puede eliminar sus propios pedidos
    if (!isAdmin) {
      whereCondition.id_usuario = req.user.id;
    }

    const pedido = await Pedido.findOne({ where: whereCondition });

    if (!pedido) {
      return res.status(404).json({ 
        message: "Pedido no encontrado o no tienes permisos para eliminarlo" 
      });
    }

    // Eliminar el pedido (los detalles se eliminan automáticamente por CASCADE)
    await pedido.destroy();

    res.json({
      message: "Pedido eliminado exitosamente",
      pedidoId: pedido.id
    });
  } catch (error) {
    console.error("Error al eliminar pedido:", error);
    res.status(500).json({ message: "Error al eliminar pedido" });
  }
};
