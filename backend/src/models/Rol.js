import { DataTypes } from "sequelize";
import { sequelize } from "../db/index.js";

export const Rol = sequelize.define("Rol", {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  nombre: { type: DataTypes.STRING, allowNull: false }
});
