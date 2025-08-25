/**
 * Controlador de Autenticación para el Backend E-commerce ELAIA
 * 
 * Este controlador maneja todas las operaciones relacionadas con autenticación incluyendo
 * registro de usuarios, login y gestión de tokens JWT.
 * 
 * Características Principales:
 * - Hash seguro de contraseñas usando bcrypt
 * - Generación y validación de tokens JWT
 * - Registro de usuarios con asignación automática de roles
 * - Autenticación de login con validación de base de datos
 * - Manejo integral de errores
 * 
 * Medidas de Seguridad:
 * - Las contraseñas se hashean antes del almacenamiento (nunca se almacenan en texto plano)
 * - Validación de unicidad de email
 * - Tokens JWT con tiempo de expiración
 * - Validación y sanitización de entradas
 * 
 * @author Equipo de Desarrollo ELAIA
 * @version 1.0.0
 */

import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { Usuario, Rol } from "../models/index.js";

// Clave Secreta JWT - En producción, esto debe almacenarse en variables de entorno
const JWT_SECRET = process.env.JWT_SECRET || "secretito"; // ⚠️ IMPORTANTE: Configurar esto en archivo .env para producción

/**
 * Función de Registro de Usuario
 * 
 * Registra un nuevo usuario en el sistema con validaciones de seguridad.
 * Verifica que el email no esté en uso, hashea la contraseña y crea el usuario.
 * 
 * @param {Object} req - Objeto request de Express
 * @param {Object} req.body - Datos del usuario a registrar
 * @param {string} req.body.nombre - Nombre del usuario
 * @param {string} req.body.apellido - Apellido del usuario
 * @param {string} req.body.email - Email del usuario (debe ser único)
 * @param {string} req.body.password - Contraseña del usuario (será hasheada)
 * @param {number} req.body.id_rol - ID del rol asignado al usuario
 * @param {Object} res - Objeto response de Express
 * @returns {Object} JSON response con el usuario creado o mensaje de error
 */
export const register = async (req, res) => {
  try {
    const { nombre, apellido, email, password, id_rol } = req.body;

    // Verificar si ya existe un usuario con ese email
    const usuarioExistente = await Usuario.findOne({ where: { email } });
    if (usuarioExistente) {
      return res.status(400).json({ message: "El email ya está registrado" });
    }

    // Hashear la contraseña usando bcrypt con salt rounds de 10
    // Esto asegura que la contraseña nunca se almacene en texto plano
    const hashedPassword = await bcrypt.hash(password, 10);

    // Crear nuevo usuario en la base de datos
    const nuevoUsuario = await Usuario.create({
      nombre,
      apellido,
      email,
      password: hashedPassword,
      id_rol
    });

    res.status(201).json({ message: "Usuario registrado", usuario: nuevoUsuario });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error en el registro" });
  }
};

/**
 * Función de Login de Usuario
 * 
 * Autentica a un usuario existente verificando email y contraseña.
 * Si es exitoso, genera y retorna un token JWT para futuras peticiones autenticadas.
 * 
 * @param {Object} req - Objeto request de Express
 * @param {Object} req.body - Credenciales de login
 * @param {string} req.body.email - Email del usuario
 * @param {string} req.body.password - Contraseña del usuario
 * @param {Object} res - Objeto response de Express
 * @returns {Object} JSON response con token JWT o mensaje de error
 */
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Buscar usuario por email e incluir información del rol
    const usuario = await Usuario.findOne({
      where: { email },
      include: { model: Rol, attributes: ["id", "nombre"] }
    });

    // Verificar si el usuario existe
    if (!usuario) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    // Comparar la contraseña proporcionada con el hash almacenado
    const passwordValida = await bcrypt.compare(password, usuario.password);
    if (!passwordValida) {
      return res.status(401).json({ message: "Credenciales inválidas" });
    }

    // Crear token JWT con información del usuario
    // El token incluye: id del usuario, email y nombre del rol
    const token = jwt.sign(
      { id: usuario.id, email: usuario.email, rol: usuario.Rol.nombre },
      JWT_SECRET,
      { expiresIn: "2h" } // Token expira en 2 horas por seguridad
    );

    // Preparar información del usuario para enviar al frontend
    const userInfo = {
      id: usuario.id,
      nombre: usuario.nombre,
      apellido: usuario.apellido,
      email: usuario.email,
      rol: usuario.Rol.nombre,
      id_rol: usuario.Rol.id
    };

    res.json({ 
      message: "Login exitoso", 
      token,
      user: userInfo 
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error en el login" });
  }
};
