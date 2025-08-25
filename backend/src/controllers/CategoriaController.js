/**
 * Controlador de Categorías para ELAIA E-commerce
 * 
 * Este controlador maneja todas las operaciones CRUD relacionadas con categorías de productos.
 * Las categorías permiten organizar y clasificar los productos para facilitar la navegación.
 * 
 * Características Principales:
 * - Operaciones CRUD completas para categorías
 * - Restricciones de acceso: solo administradores pueden crear/actualizar/eliminar
 * - Consultas públicas para listado de categorías
 * - Inclusión de productos asociados en consultas detalladas
 * - Validación de integridad referencial
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

import { Categoria, Producto } from "../models/index.js";
import { Op } from "sequelize";

/**
 * Obtener todas las categorías
 * 
 * Endpoint público que permite obtener la lista completa de categorías.
 * Útil para mostrar filtros y navegación en el frontend.
 * 
 * @param {Object} req - Objeto request de Express
 * @param {Object} req.query - Parámetros de consulta opcionales
 * @param {string} req.query.includeProducts - Si incluir productos asociados (true/false)
 * @param {Object} res - Objeto response de Express
 * @returns {Object} JSON response con lista de categorías
 */
export const getCategorias = async (req, res) => {
  try {
    const { includeProducts } = req.query;
    
    const queryOptions = {
      order: [['nombre', 'ASC']] // Ordenar alfabéticamente
    };

    // Incluir productos si se solicita
    if (includeProducts === 'true') {
      queryOptions.include = [{
        model: Producto,
        attributes: ["id", "nombre", "precio"],
        through: { attributes: [] } // Excluir campos de tabla intermedia
      }];
    }

    const categorias = await Categoria.findAll(queryOptions);

    res.json({
      categorias,
      total: categorias.length
    });
  } catch (error) {
    console.error("Error al obtener categorías:", error);
    res.status(500).json({ message: "Error al obtener categorías" });
  }
};

/**
 * Obtener una categoría por ID
 * 
 * Endpoint público para obtener los detalles de una categoría específica.
 * Incluye todos los productos asociados a la categoría.
 * 
 * @param {Object} req - Objeto request de Express
 * @param {string} req.params.id - ID de la categoría a obtener
 * @param {Object} res - Objeto response de Express
 * @returns {Object} JSON response con datos de la categoría o error 404
 */
export const getCategoriaById = async (req, res) => {
  try {
    const categoria = await Categoria.findByPk(req.params.id, {
      include: [{
        model: Producto,
        attributes: ["id", "nombre", "descripcion", "precio", "imagen_url"],
        through: { attributes: [] }
      }]
    });

    if (!categoria) {
      return res.status(404).json({ message: "Categoría no encontrada" });
    }

    res.json(categoria);
  } catch (error) {
    console.error("Error al obtener categoría:", error);
    res.status(500).json({ message: "Error al obtener categoría" });
  }
};

/**
 * Crear una nueva categoría (Solo Administradores)
 * 
 * Crea una nueva categoría en el sistema. Requiere permisos de administrador.
 * 
 * @param {Object} req - Objeto request de Express
 * @param {Object} req.body - Datos de la categoría a crear
 * @param {string} req.body.nombre - Nombre de la categoría (obligatorio)
 * @param {Object} res - Objeto response de Express
 * @returns {Object} JSON response con categoría creada
 */
export const createCategoria = async (req, res) => {
  try {
    const { nombre } = req.body;

    // Validar campo obligatorio
    if (!nombre) {
      return res.status(400).json({ 
        message: "El nombre de la categoría es obligatorio" 
      });
    }

    // Verificar que no exista una categoría con el mismo nombre
    const categoriaExistente = await Categoria.findOne({ 
      where: { nombre } 
    });

    if (categoriaExistente) {
      return res.status(400).json({ 
        message: "Ya existe una categoría con este nombre" 
      });
    }

    // Crear la categoría
    const nuevaCategoria = await Categoria.create({ nombre });

    res.status(201).json({
      message: "Categoría creada exitosamente",
      categoria: nuevaCategoria
    });
  } catch (error) {
    console.error("Error al crear categoría:", error);
    res.status(500).json({ message: "Error al crear categoría" });
  }
};

/**
 * Actualizar una categoría existente (Solo Administradores)
 * 
 * Actualiza el nombre de una categoría existente. Requiere permisos de administrador.
 * 
 * @param {Object} req - Objeto request de Express
 * @param {string} req.params.id - ID de la categoría a actualizar
 * @param {Object} req.body - Nuevos datos de la categoría
 * @param {string} req.body.nombre - Nuevo nombre de la categoría
 * @param {Object} res - Objeto response de Express
 * @returns {Object} JSON response con categoría actualizada
 */
export const updateCategoria = async (req, res) => {
  try {
    const { nombre } = req.body;

    // Validar campo obligatorio
    if (!nombre) {
      return res.status(400).json({ 
        message: "El nombre de la categoría es obligatorio" 
      });
    }

    const categoria = await Categoria.findByPk(req.params.id);

    if (!categoria) {
      return res.status(404).json({ message: "Categoría no encontrada" });
    }

    // Verificar que no exista otra categoría con el mismo nombre
    const categoriaExistente = await Categoria.findOne({ 
      where: { 
        nombre,
        id: { [Op.ne]: req.params.id } // Excluir la categoría actual
      } 
    });

    if (categoriaExistente) {
      return res.status(400).json({ 
        message: "Ya existe otra categoría con este nombre" 
      });
    }

    // Actualizar la categoría
    await categoria.update({ nombre });

    res.json({
      message: "Categoría actualizada exitosamente",
      categoria
    });
  } catch (error) {
    console.error("Error al actualizar categoría:", error);
    res.status(500).json({ message: "Error al actualizar categoría" });
  }
};

/**
 * Eliminar una categoría (Solo Administradores)
 * 
 * Elimina una categoría del sistema. Requiere permisos de administrador.
 * Antes de eliminar, verifica que no tenga productos asociados.
 * 
 * @param {Object} req - Objeto request de Express
 * @param {string} req.params.id - ID de la categoría a eliminar
 * @param {Object} res - Objeto response de Express
 * @returns {Object} JSON response confirmando eliminación o error
 */
export const deleteCategoria = async (req, res) => {
  try {
    const categoria = await Categoria.findByPk(req.params.id, {
      include: [{
        model: Producto,
        attributes: ["id"]
      }]
    });

    if (!categoria) {
      return res.status(404).json({ message: "Categoría no encontrada" });
    }

    // Verificar que no tenga productos asociados
    if (categoria.Productos && categoria.Productos.length > 0) {
      return res.status(400).json({ 
        message: "No se puede eliminar la categoría porque tiene productos asociados",
        productosAsociados: categoria.Productos.length
      });
    }

    // Eliminar la categoría
    await categoria.destroy();

    res.json({
      message: "Categoría eliminada exitosamente",
      categoriaEliminada: {
        id: categoria.id,
        nombre: categoria.nombre
      }
    });
  } catch (error) {
    console.error("Error al eliminar categoría:", error);
    res.status(500).json({ message: "Error al eliminar categoría" });
  }
};
