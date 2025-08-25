/**
 * Modelo de Usuario para ELAIA E-commerce
 * 
 * Este modelo define la estructura y relaciones de la tabla de usuarios en la base de datos.
 * Utiliza Sequelize ORM para la gestión de datos y relaciones.
 * 
 * Características del Modelo:
 * - Gestión automática de IDs (auto-incremento)
 * - Validación de email único
 * - Relación con tabla de Roles (Many-to-One)
 * - Campos obligatorios para integridad de datos
 * 
 * Relaciones:
 * - Un Usuario pertenece a un Rol (belongsTo)
 * - Un Rol puede tener muchos Usuarios (hasMany)
 * 
 * @author Equipo de Desarrollo ELAIA
 * @version 1.0.0
 */

import { DataTypes } from "sequelize";
import { sequelize } from "../db/index.js";
import { Rol } from "./Rol.js";

/**
 * Definición del Modelo Usuario
 * 
 * Estructura de campos:
 * - id: Identificador único auto-incrementable
 * - nombre: Nombre del usuario (obligatorio)
 * - apellido: Apellido del usuario (obligatorio)
 * - email: Email del usuario (obligatorio y único)
 * - password: Contraseña hasheada del usuario (obligatorio)
 */
export const Usuario = sequelize.define("Usuario", {
  id: { 
    type: DataTypes.INTEGER, 
    autoIncrement: true, 
    primaryKey: true 
  },
  nombre: { 
    type: DataTypes.STRING, 
    allowNull: false 
  },
  apellido: { 
    type: DataTypes.STRING, 
    allowNull: false 
  },
  email: { 
    type: DataTypes.STRING, 
    allowNull: false, 
    unique: true  // Garantiza que no haya emails duplicados
  },
  password: { 
    type: DataTypes.STRING, 
    allowNull: false 
  }
});

// Definición de Relaciones

// Relación: Usuario pertenece a un Rol
// Esto permite que cada usuario tenga un rol específico (admin, cliente, etc.)
Usuario.belongsTo(Rol, { foreignKey: "id_rol" });

// Relación inversa: Un Rol puede tener muchos Usuarios
// Esto permite consultar todos los usuarios que tienen un rol específico
Rol.hasMany(Usuario, { foreignKey: "id_rol" });
