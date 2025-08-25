/**
 * Controlador de Roles para ELAIA E-commerce
 * 
 * Este controlador maneja todas las operaciones CRUD relacionadas con roles de usuarios.
 * Los roles definen los permisos y niveles de acceso en el sistema.
 * 
 * Roles del Sistema:
 * - Administrador (id: 1): Acceso completo al sistema
 * - Cliente (id: 2): Acceso limitado a funciones de usuario
 * 
 * Todas las operaciones requieren autenticación y permisos de administrador.
 * 
 * @author Equipo de Desarrollo ELAIA
 * @version 1.0.0
 */

import { Rol, Usuario } from "../models/index.js";
import { Op } from "sequelize";

/**
 * Obtener todos los roles del sistema
 * 
 * Lista todos los roles disponibles en el sistema.
 * Útil para formularios de asignación de roles y administración.
 * 
 * @param {Object} req - Objeto request de Express
 * @param {Object} res - Objeto response de Express
 * @returns {Object} JSON response con lista de roles
 */
export const getRoles = async (req, res) => {
  try {
    const roles = await Rol.findAll({
      include: [{
        model: Usuario,
        attributes: ["id", "nombre", "apellido", "email"],
        required: false // LEFT JOIN para incluir roles sin usuarios
      }],
      order: [['id', 'ASC']] // Ordenar por ID para consistencia
    });
    
    res.json({
      roles,
      total: roles.length
    });
  } catch (error) {
    console.error("Error al obtener roles:", error);
    res.status(500).json({ message: "Error al obtener roles" });
  }
};

/**
 * Obtener un rol específico por ID
 * 
 * @param {Object} req - Objeto request de Express
 * @param {string} req.params.id - ID del rol a obtener
 * @param {Object} res - Objeto response de Express
 * @returns {Object} JSON response con datos del rol o error 404
 */
export const getRolById = async (req, res) => {
  try {
    const rol = await Rol.findByPk(req.params.id);
    
    if (!rol) {
      return res.status(404).json({ message: "Rol no encontrado" });
    }
    
    res.json(rol);
  } catch (error) {
    console.error("Error al obtener rol:", error);
    res.status(500).json({ message: "Error al obtener rol" });
  }
};

/**
 * Crear un nuevo rol (Solo Administradores)
 * 
 * @param {Object} req - Objeto request de Express
 * @param {Object} req.body - Datos del rol a crear
 * @param {string} req.body.nombre - Nombre del rol (obligatorio)
 * @param {Object} res - Objeto response de Express
 * @returns {Object} JSON response con rol creado
 */
export const createRol = async (req, res) => {
  try {
    const { nombre } = req.body;
    
    // Validar campo obligatorio
    if (!nombre) {
      return res.status(400).json({ 
        message: "El nombre del rol es obligatorio" 
      });
    }
    
    // Verificar que no exista un rol con el mismo nombre
    const rolExistente = await Rol.findOne({ where: { nombre } });
    if (rolExistente) {
      return res.status(400).json({ 
        message: "Ya existe un rol con este nombre" 
      });
    }
    
    const nuevoRol = await Rol.create({ nombre });
    
    res.status(201).json({
      message: "Rol creado exitosamente",
      rol: nuevoRol
    });
  } catch (error) {
    console.error("Error al crear rol:", error);
    res.status(500).json({ message: "Error al crear rol" });
  }
};

/**
 * Actualizar un rol existente (Solo Administradores)
 * 
 * @param {Object} req - Objeto request de Express
 * @param {string} req.params.id - ID del rol a actualizar
 * @param {Object} req.body - Nuevos datos del rol
 * @param {string} req.body.nombre - Nuevo nombre del rol
 * @param {Object} res - Objeto response de Express
 * @returns {Object} JSON response con rol actualizado
 */
export const updateRol = async (req, res) => {
  try {
    const { nombre } = req.body;
    
    // Validar campo obligatorio
    if (!nombre) {
      return res.status(400).json({ 
        message: "El nombre del rol es obligatorio" 
      });
    }
    
    const rol = await Rol.findByPk(req.params.id);
    
    if (!rol) {
      return res.status(404).json({ message: "Rol no encontrado" });
    }
    
    // Verificar que no exista otro rol con el mismo nombre
    const rolExistente = await Rol.findOne({ 
      where: { 
        nombre,
        id: { [Op.ne]: req.params.id } // Excluir el rol actual
      } 
    });
    
    if (rolExistente) {
      return res.status(400).json({ 
        message: "Ya existe otro rol con este nombre" 
      });
    }
    
    await rol.update({ nombre });
    
    res.json({
      message: "Rol actualizado exitosamente",
      rol
    });
  } catch (error) {
    console.error("Error al actualizar rol:", error);
    res.status(500).json({ message: "Error al actualizar rol" });
  }
};

/**
 * Eliminar un rol (Solo Administradores)
 * 
 * PRECAUCIÓN: No se puede eliminar un rol que tenga usuarios asociados.
 * Se debe verificar la integridad referencial antes de eliminar.
 * 
 * @param {Object} req - Objeto request de Express
 * @param {string} req.params.id - ID del rol a eliminar
 * @param {Object} res - Objeto response de Express
 * @returns {Object} JSON response confirmando eliminación
 */
export const deleteRol = async (req, res) => {
  try {
    const rol = await Rol.findByPk(req.params.id, {
      include: [{
        model: Usuario,
        attributes: ["id"]
      }]
    });
    
    if (!rol) {
      return res.status(404).json({ message: "Rol no encontrado" });
    }
    
    // Verificar que no tenga usuarios asociados
    if (rol.Usuarios && rol.Usuarios.length > 0) {
      return res.status(400).json({ 
        message: "No se puede eliminar el rol porque tiene usuarios asociados",
        usuariosAsociados: rol.Usuarios.length
      });
    }
    
    await rol.destroy();
    
    res.json({
      message: "Rol eliminado exitosamente",
      rolEliminado: {
        id: rol.id,
        nombre: rol.nombre
      }
    });
  } catch (error) {
    console.error("Error al eliminar rol:", error);
    res.status(500).json({ message: "Error al eliminar rol" });
  }
};
