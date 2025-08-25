import { DataTypes } from "sequelize";
import { sequelize } from "../db/index.js";

export const CategoriaProducto = sequelize.define("CategoriaProducto", {
  id_categoria: { type: DataTypes.INTEGER, primaryKey: true },
  id_producto: { type: DataTypes.INTEGER, primaryKey: true }
});
