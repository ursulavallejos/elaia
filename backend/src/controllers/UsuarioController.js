import { Usuario, Rol } from "../models/index.js";

// Obtener todos los usuarios (incluyendo su rol)
export const getUsuarios = async (req, res) => {
  try {
    const usuarios = await Usuario.findAll({
      include: { model: Rol, attributes: ["id", "nombre"] }
    });
    res.json(usuarios);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al obtener usuarios" });
  }
};

// Obtener un usuario por ID
export const getUsuarioById = async (req, res) => {
  try {
    const usuario = await Usuario.findByPk(req.params.id, {
      include: { model: Rol, attributes: ["id", "nombre"] }
    });
    if (!usuario) return res.status(404).json({ message: "Usuario no encontrado" });
    res.json(usuario);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener usuario" });
  }
};

// Crear usuario
export const createUsuario = async (req, res) => {
  try {
    const { nombre, apellido, email, password, id_rol } = req.body;
    const nuevoUsuario = await Usuario.create({ nombre, apellido, email, password, id_rol });
    res.status(201).json(nuevoUsuario);
  } catch (error) {
    res.status(500).json({ message: "Error al crear usuario" });
  }
};

// Actualizar usuario
export const updateUsuario = async (req, res) => {
  try {
    const { nombre, apellido, email, password, id_rol } = req.body;
    const usuario = await Usuario.findByPk(req.params.id);

    if (!usuario) return res.status(404).json({ message: "Usuario no encontrado" });

    await usuario.update({ nombre, apellido, email, password, id_rol });
    res.json(usuario);
  } catch (error) {
    res.status(500).json({ message: "Error al actualizar usuario" });
  }
};

// Eliminar usuario
export const deleteUsuario = async (req, res) => {
  try {
    const usuario = await Usuario.findByPk(req.params.id);

    if (!usuario) return res.status(404).json({ message: "Usuario no encontrado" });

    await usuario.destroy();
    res.json({ message: "Usuario eliminado" });
  } catch (error) {
    res.status(500).json({ message: "Error al eliminar usuario" });
  }
};
