import { DataTypes } from "sequelize";
import { sequelize } from "../db/index.js";

export const DetallePedido = sequelize.define("DetallePedido", {
  id: { 
    type: DataTypes.INTEGER, 
    autoIncrement: true, 
    primaryKey: true 
  },
  id_pedido: { 
    type: DataTypes.INTEGER, 
    allowNull: false 
  },
  id_producto: { 
    type: DataTypes.INTEGER, 
    allowNull: false 
  },
  cantidad: { 
    type: DataTypes.INTEGER, 
    allowNull: false,
    defaultValue: 1 
  },
  precio_unitario: { 
    type: DataTypes.FLOAT, 
    allowNull: false 
  }
});
