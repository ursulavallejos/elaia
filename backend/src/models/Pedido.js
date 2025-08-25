/**
 * Modelo de Pedido para ELAIA E-commerce
 * 
 * Este modelo define la estructura de los pedidos realizados por usuarios.
 * Los pedidos representan las compras y contienen información sobre productos adquiridos.
 * 
 * Características del Modelo:
 * - Gestión automática de IDs (auto-incremento)
 * - Estados de pedido para seguimiento de proceso
 * - Fecha automática de creación
 * - Relación con usuario propietario
 * - Relación many-to-many con productos través de DetallePedido
 * 
 * Estados Válidos:
 * - pendiente: Pedido recibido, esperando procesamiento
 * - procesando: Pedido en preparación
 * - enviado: Pedido despachado al cliente
 * - entregado: Pedido recibido por el cliente
 * - cancelado: Pedido cancelado
 * 
 * @author Equipo de Desarrollo ELAIA
 * @version 1.0.0
 */

import { DataTypes } from "sequelize";
import { sequelize } from "../db/index.js";

/**
 * Definición del Modelo Pedido
 * 
 * Estructura de campos:
 * - id: Identificador único auto-incrementable
 * - estado: Estado actual del pedido (obligatorio)
 * - fecha: Fecha y hora de creación del pedido (automática)
 * - id_usuario: Referencia al usuario que realizó el pedido (foreign key)
 */
export const Pedido = sequelize.define("Pedido", {
  id: { 
    type: DataTypes.INTEGER, 
    autoIncrement: true, 
    primaryKey: true 
  },
  fecha: { 
    type: DataTypes.DATE, 
    defaultValue: DataTypes.NOW 
  }
});
