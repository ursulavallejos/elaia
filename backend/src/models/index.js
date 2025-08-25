/**
 * Índice de Modelos y Relaciones para ELAIA E-commerce
 * 
 * Este archivo centraliza todos los modelos de Sequelize y define las relaciones
 * entre las entidades del sistema. Es crucial para el correcto funcionamiento
 * del ORM y las consultas con joins.
 * 
 * Modelos del Sistema:
 * - Rol: Define tipos de usuario (Admin, Cliente)
 * - Usuario: Datos de usuarios registrados
 * - Producto: Catálogo de productos (batas, cosmetiqueros)
 * - Categoria: Clasificación de productos
 * - Pedido: Órdenes de compra realizadas
 * - DetallePedido: Productos específicos en cada pedido
 * - CategoriaProducto: Relación many-to-many entre categorías y productos
 * 
 * Relaciones Principales:
 * - Usuario ↔ Rol (Many-to-One)
 * - Usuario ↔ Pedido (One-to-Many) 
 * - Producto ↔ Categoria (Many-to-Many)
 * - Pedido ↔ Producto (Many-to-Many)
 * 
 * @author Equipo de Desarrollo ELAIA
 * @version 1.0.0
 */

import { Rol } from "./Rol.js";
import { Usuario } from "./Usuario.js";
import { Pedido } from "./Pedido.js";
import { Producto } from "./Producto.js";
import { Categoria } from "./Categoria.js";
import { CategoriaProducto } from "./CategoriaProducto.js";
import { DetallePedido } from "./DetallePedido.js";

// =====================================================
// DEFINICIÓN DE RELACIONES ENTRE MODELOS
// =====================================================

/**
 * Relación Usuario - Rol (Many-to-One)
 * Un usuario pertenece a un rol, un rol puede tener muchos usuarios
 */
Usuario.belongsTo(Rol, { foreignKey: "id_rol" });
Rol.hasMany(Usuario, { foreignKey: "id_rol" });

/**
 * Relación Pedido - Usuario (Many-to-One)
 * Un pedido pertenece a un usuario, un usuario puede tener muchos pedidos
 */
Pedido.belongsTo(Usuario, { foreignKey: "id_usuario" });
Usuario.hasMany(Pedido, { foreignKey: "id_usuario" });

/**
 * Relación Pedido - DetallePedido (One-to-Many)
 * Un pedido puede tener muchos detalles, un detalle pertenece a un pedido
 */
Pedido.hasMany(DetallePedido, { foreignKey: "id_pedido" });
DetallePedido.belongsTo(Pedido, { foreignKey: "id_pedido" });

/**
 * Relación Producto - DetallePedido (One-to-Many)
 * Un producto puede estar en muchos detalles, un detalle pertenece a un producto
 */
Producto.hasMany(DetallePedido, { foreignKey: "id_producto" });
DetallePedido.belongsTo(Producto, { foreignKey: "id_producto" });

/**
 * Relación Pedido - Producto (Many-to-Many)
 * Un pedido puede contener muchos productos, un producto puede estar en muchos pedidos
 * Se relaciona a través de la tabla intermedia DetallePedido
 */
Pedido.belongsToMany(Producto, { 
  through: DetallePedido, 
  foreignKey: "id_pedido",
  otherKey: "id_producto"
});
Producto.belongsToMany(Pedido, { 
  through: DetallePedido, 
  foreignKey: "id_producto",
  otherKey: "id_pedido"
});

/**
 * Relación Producto - Categoria (Many-to-Many)
 * Un producto puede pertenecer a muchas categorías, una categoría puede tener muchos productos
 * Se relaciona a través de la tabla intermedia CategoriaProducto
 */
Producto.belongsToMany(Categoria, { 
  through: CategoriaProducto, 
  foreignKey: "id_producto",
  otherKey: "id_categoria"
});
Categoria.belongsToMany(Producto, { 
  through: CategoriaProducto, 
  foreignKey: "id_categoria",
  otherKey: "id_producto"
});

// =====================================================
// EXPORTACIÓN DE MODELOS
// =====================================================

export {
  Rol,
  Usuario,
  Pedido,
  Producto,
  Categoria,
  CategoriaProducto,
  DetallePedido
};
