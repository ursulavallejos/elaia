/**
 * Configuración de Conexión a Base de Datos para ELAIA E-commerce
 * 
 * Este archivo establece la conexión con la base de datos PostgreSQL usando Sequelize ORM.
 * Utiliza variables de entorno para la configuración, permitiendo diferentes settings
 * para desarrollo, testing y producción.
 * 
 * Características de la Configuración:
 * - Soporte para variables de entorno (.env)
 * - Valores por defecto para desarrollo local
 * - Configuración para PostgreSQL
 * - Separación de configuración del código
 * 
 * Variables de Entorno Soportadas:
 * - DB_NAME: Nombre de la base de datos
 * - DB_USER: Usuario de la base de datos
 * - DB_PASSWORD: Contraseña de la base de datos
 * - DB_HOST: Host de la base de datos
 * - DB_PORT: Puerto de la base de datos
 * 
 * @author Equipo de Desarrollo ELAIA
 * @version 1.0.0
 */

import { Sequelize } from "sequelize";
import dotenv from "dotenv";

// Cargar variables de entorno desde archivo .env
dotenv.config();

/**
 * Instancia de Sequelize para conexión a PostgreSQL
 * 
 * Configuración:
 * - Base de datos: elaia (por defecto)
 * - Usuario: postgres (por defecto)
 * - Host: localhost (por defecto)
 * - Puerto: 5432 (por defecto)
 * - Dialecto: PostgreSQL
 * 
 * Las variables de entorno tienen prioridad sobre los valores por defecto
 */
export const sequelize = new Sequelize(
  process.env.DB_NAME || "elaia",        // Nombre de la base de datos
  process.env.DB_USER || "postgres",     // Usuario de la base de datos
  process.env.DB_PASSWORD || "",         // Contraseña (vacía por defecto para desarrollo)
  {
    host: process.env.DB_HOST || "localhost",  // Host de la base de datos
    port: process.env.DB_PORT || 5432,         // Puerto de PostgreSQL
    dialect: "postgres",                       // Especifica que usamos PostgreSQL
  }
);
