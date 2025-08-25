/**
 * Modelo de Producto para ELAIA E-commerce
 * 
 * Este modelo define la estructura de los productos en la base de datos.
 * Los productos son el core del e-commerce, incluyendo batas y cosmetiqueros.
 * 
 * Características del Modelo:
 * - Gestión automática de IDs (auto-incremento)
 * - Información completa del producto (nombre, descripción, precio)
 * - Soporte para imágenes mediante URL
 * - Flag de personalización para productos customizables
 * - Relaciones con categorías y pedidos
 * 
 * Relaciones:
 * - Un Producto puede pertenecer a muchas Categorías (belongsToMany)
 * - Un Producto puede estar en muchos Pedidos (belongsToMany)
 * 
 * @author Equipo de Desarrollo ELAIA
 * @version 1.0.0
 */

import { DataTypes } from "sequelize";
import { sequelize } from "../db/index.js";

/**
 * Definición del Modelo Producto
 * 
 * Estructura de campos:
 * - id: Identificador único auto-incrementable
 * - nombre: Nombre del producto (obligatorio)
 * - descripcion: Descripción detallada del producto (opcional)
 * - precio: Precio del producto en pesos chilenos (obligatorio)
 * - imagen_url: URL de la imagen del producto (opcional)
 */
export const Producto = sequelize.define("Producto", {
  id: { 
    type: DataTypes.INTEGER, 
    autoIncrement: true, 
    primaryKey: true 
  },
  nombre: { 
    type: DataTypes.STRING, 
    allowNull: false 
  },
  descripcion: { 
    type: DataTypes.TEXT 
  },
  precio: { 
    type: DataTypes.FLOAT, 
    allowNull: false 
  },
  imagen_url: { 
    type: DataTypes.STRING 
  }
});
