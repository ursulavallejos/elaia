/**
 * Modelo de Categoría para ELAIA E-commerce
 * 
 * Este modelo define la estructura de las categorías de productos en la base de datos.
 * Las categorías permiten organizar y clasificar los productos para una mejor navegación.
 * 
 * Características del Modelo:
 * - Gestión automática de IDs (auto-incremento)
 * - Nombre de categoría obligatorio
 * - Relación Many-to-Many con productos
 * - Timestamps automáticos (createdAt, updatedAt)
 * 
 * Relaciones:
 * - Una Categoría puede tener muchos Productos (belongsToMany)
 * - Se relaciona a través de la tabla intermedia CategoriaProducto
 * 
 * @author Equipo de Desarrollo ELAIA
 * @version 1.0.0
 */

import { DataTypes } from "sequelize";
import { sequelize } from "../db/index.js";

/**
 * Definición del Modelo Categoría
 * 
 * Estructura de campos:
 * - id: Identificador único auto-incrementable
 * - nombre: Nombre de la categoría (obligatorio)
 */
export const Categoria = sequelize.define("Categoria", {
  id: { 
    type: DataTypes.INTEGER, 
    autoIncrement: true, 
    primaryKey: true 
  },
  nombre: { 
    type: DataTypes.STRING, 
    allowNull: false 
  }
});
