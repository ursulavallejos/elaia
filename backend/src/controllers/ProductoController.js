/**
 * Controlador de Productos para ELAIA E-commerce
 * 
 * Este controlador maneja todas las operaciones CRUD relacionadas con productos.
 * Los productos son el núcleo del e-commerce e incluyen batas y cosmetiqueros.
 * 
 * Características Principales:
 * - Operaciones CRUD completas para productos
 * - Restricciones de acceso: solo administradores pueden crear/actualizar/eliminar
 * - Consultas públicas para listado y detalle de productos
 * - Filtrado por categorías y características
 * - Búsqueda por nombre y descripción
 * - Inclusión de relaciones con categorías
 * 
 * Permisos de Acceso:
 * - GET (listar/ver): Público (sin autenticación)
 * - POST (crear): Solo administradores
 * - PUT (actualizar): Solo administradores
 * - DELETE (eliminar): Solo administradores
 * 
 * @author Equipo de Desarrollo ELAIA
 * @version 1.0.0
 */

import { Producto, Categoria } from "../models/index.js";
import { Op } from "sequelize";

/**
 * Obtener todos los productos con filtros opcionales
 * 
 * Endpoint público que permite obtener la lista de productos con filtros opcionales.
 * Incluye información de categorías asociadas para cada producto.
 * 
 * @param {Object} req - Objeto request de Express
 * @param {Object} req.query - Parámetros de consulta opcionales
 * @param {string} req.query.categoria - Filtrar por nombre de categoría

 * @param {string} req.query.search - Buscar en nombre y descripción
 * @param {number} req.query.limit - Límite de resultados
 * @param {number} req.query.offset - Desplazamiento para paginación
 * @param {Object} res - Objeto response de Express
 * @returns {Object} JSON response con lista de productos
 */
export const getProductos = async (req, res) => {
  try {
    const { categoria, search, limit, offset } = req.query;
    
    // Configurar opciones de consulta
    const queryOptions = {
      include: [{
        model: Categoria,
        attributes: ["id", "nombre"],
        through: { attributes: [] } // Excluir campos de tabla intermedia
      }],
      order: [['createdAt', 'DESC']] // Ordenar por más recientes
    };

    // Configurar filtros WHERE
    const whereConditions = {};

    // Filtro por búsqueda en nombre y descripción
    if (search) {
      whereConditions[Op.or] = [
        { nombre: { [Op.iLike]: `%${search}%` } },
        { descripcion: { [Op.iLike]: `%${search}%` } }
      ];
    }

    // Aplicar condiciones WHERE si existen
    if (Object.keys(whereConditions).length > 0) {
      queryOptions.where = whereConditions;
    }

    // Filtro por categoría (requiere join)
    if (categoria) {
      queryOptions.include[0].where = {
        nombre: { [Op.iLike]: `%${categoria}%` }
      };
      queryOptions.include[0].required = true; // INNER JOIN
    }

    // Paginación
    if (limit) {
      queryOptions.limit = parseInt(limit);
    }
    if (offset) {
      queryOptions.offset = parseInt(offset);
    }

    const productos = await Producto.findAndCountAll(queryOptions);

    res.json({
      productos: productos.rows,
      total: productos.count,
      filtros: {
        categoria,
        search,
        limit: limit ? parseInt(limit) : null,
        offset: offset ? parseInt(offset) : 0
      }
    });
  } catch (error) {
    console.error("Error al obtener productos:", error);
    res.status(500).json({ message: "Error al obtener productos" });
  }
};

/**
 * Obtener un producto por ID
 * 
 * Endpoint público para obtener los detalles de un producto específico.
 * Incluye todas las categorías asociadas al producto.
 * 
 * @param {Object} req - Objeto request de Express
 * @param {string} req.params.id - ID del producto a obtener
 * @param {Object} res - Objeto response de Express
 * @returns {Object} JSON response con datos del producto o error 404
 */
export const getProductoById = async (req, res) => {
  try {
    const producto = await Producto.findByPk(req.params.id, {
      include: [{
        model: Categoria,
        attributes: ["id", "nombre"],
        through: { attributes: [] }
      }]
    });

    if (!producto) {
      return res.status(404).json({ message: "Producto no encontrado" });
    }

    res.json(producto);
  } catch (error) {
    console.error("Error al obtener producto:", error);
    res.status(500).json({ message: "Error al obtener producto" });
  }
};

/**
 * Crear un nuevo producto (Solo Administradores)
 * 
 * Crea un nuevo producto en el sistema. Requiere permisos de administrador.
 * Opcionalmente puede asociar el producto con categorías existentes.
 * 
 * @param {Object} req - Objeto request de Express
 * @param {Object} req.body - Datos del producto a crear
 * @param {string} req.body.nombre - Nombre del producto (obligatorio)
 * @param {string} req.body.descripcion - Descripción del producto (opcional)
 * @param {number} req.body.precio - Precio del producto (obligatorio)
 * @param {string} req.body.imagen_url - URL de imagen (opcional)

 * @param {Array<number>} req.body.categorias - IDs de categorías a asociar (opcional)
 * @param {Object} res - Objeto response de Express
 * @returns {Object} JSON response con producto creado
 */
export const createProducto = async (req, res) => {
  try {
    const { nombre, descripcion, precio, imagen_url, categorias } = req.body;

    // Validar campos obligatorios
    if (!nombre || !precio) {
      return res.status(400).json({ 
        message: "Nombre y precio son campos obligatorios" 
      });
    }

    // Validar que se asigne al menos una categoría
    if (!categorias || !Array.isArray(categorias) || categorias.length === 0) {
      return res.status(400).json({ 
        message: "El producto debe tener al menos una categoría asignada." 
      });
    }

    // Crear el producto
    const nuevoProducto = await Producto.create({
      nombre,
      descripcion,
      precio,
      imagen_url
    });

    // Asociar con categorías
    const categoriasExistentes = await Categoria.findAll({
      where: { id: categorias }
    });

    // Verificar que todas las categorías existan
    if (categoriasExistentes.length !== categorias.length) {
      await nuevoProducto.destroy(); // Limpiar producto creado
      return res.status(400).json({ 
        message: "Una o más categorías no existen" 
      });
    }

    await nuevoProducto.addCategoria(categoriasExistentes);

    // Obtener el producto con sus categorías para la respuesta
    const productoCompleto = await Producto.findByPk(nuevoProducto.id, {
      include: [{
        model: Categoria,
        attributes: ["id", "nombre"],
        through: { attributes: [] }
      }]
    });

    res.status(201).json({
      message: "Producto creado exitosamente",
      producto: productoCompleto
    });
  } catch (error) {
    console.error("Error al crear producto:", error);
    res.status(500).json({ message: "Error al crear producto" });
  }
};

/**
 * Actualizar un producto existente (Solo Administradores)
 * 
 * Actualiza los datos de un producto existente. Requiere permisos de administrador.
 * Permite actualizar categorías asociadas.
 * 
 * @param {Object} req - Objeto request de Express
 * @param {string} req.params.id - ID del producto a actualizar
 * @param {Object} req.body - Nuevos datos del producto
 * @param {Object} res - Objeto response de Express
 * @returns {Object} JSON response con producto actualizado
 */
export const updateProducto = async (req, res) => {
  try {
    const { nombre, descripcion, precio, imagen_url, categorias } = req.body;

    const producto = await Producto.findByPk(req.params.id);

    if (!producto) {
      return res.status(404).json({ message: "Producto no encontrado" });
    }

    // Actualizar campos del producto
    await producto.update({
      nombre: nombre || producto.nombre,
      descripcion: descripcion !== undefined ? descripcion : producto.descripcion,
      precio: precio || producto.precio,
      imagen_url: imagen_url !== undefined ? imagen_url : producto.imagen_url
    });

    // Validar que el producto tenga al menos una categoría
    if (categorias && Array.isArray(categorias) && categorias.length === 0) {
      return res.status(400).json({ 
        message: "El producto debe tener al menos una categoría asignada. No se puede dejar un producto sin categoría."
      });
    }

    // Actualizar categorías si se proporcionaron
    if (categorias && Array.isArray(categorias)) {
      const categoriasExistentes = await Categoria.findAll({
        where: { id: categorias }
      });

      // Reemplazar todas las categorías asociadas
      await producto.setCategoria(categoriasExistentes);
    }

    // Obtener producto actualizado con categorías
    const productoActualizado = await Producto.findByPk(req.params.id, {
      include: [{
        model: Categoria,
        attributes: ["id", "nombre"],
        through: { attributes: [] }
      }]
    });

    res.json({
      message: "Producto actualizado exitosamente",
      producto: productoActualizado
    });
  } catch (error) {
    console.error("Error al actualizar producto:", error);
    res.status(500).json({ message: "Error al actualizar producto" });
  }
};

/**
 * Eliminar un producto (Solo Administradores)
 * 
 * Elimina un producto del sistema. Requiere permisos de administrador.
 * También elimina automáticamente las relaciones con categorías.
 * 
 * @param {Object} req - Objeto request de Express
 * @param {string} req.params.id - ID del producto a eliminar
 * @param {Object} res - Objeto response de Express
 * @returns {Object} JSON response confirmando eliminación
 */
export const deleteProducto = async (req, res) => {
  try {
    const producto = await Producto.findByPk(req.params.id);

    if (!producto) {
      return res.status(404).json({ message: "Producto no encontrado" });
    }

    // Verificar si el producto tiene pedidos asociados
    const { DetallePedido } = await import("../models/index.js");
    const pedidosAsociados = await DetallePedido.count({
      where: { id_producto: req.params.id }
    });

    if (pedidosAsociados > 0) {
      return res.status(400).json({ 
        message: `No se puede eliminar el producto "${producto.nombre}" porque tiene ${pedidosAsociados} pedido(s) asociado(s). Primero debe eliminar los pedidos relacionados.`
      });
    }

    // Eliminar el producto (las relaciones se eliminan automáticamente por CASCADE)
    await producto.destroy();

    res.json({
      message: "Producto eliminado exitosamente",
      productoEliminado: {
        id: producto.id,
        nombre: producto.nombre
      }
    });
  } catch (error) {
    console.error("Error al eliminar producto:", error);
    res.status(500).json({ message: "Error al eliminar producto" });
  }
};
