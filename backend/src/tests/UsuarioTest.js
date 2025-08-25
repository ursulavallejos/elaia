import request from "supertest";
import app from "../app.js"; // tu instancia de Express
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { Usuario, Rol } from "../models/index.js";
import { sequelize } from "../db/index.js";

const JWT_SECRET = process.env.JWT_SECRET || "secretito";

let token;

beforeAll(async () => {
  await sequelize.sync({ force: true });

  const rol = await Rol.create({ nombre: "Admin" });

  // Hashear password
  const hashedPassword = await bcrypt.hash("123456", 10);

  const usuarioAdmin = await Usuario.create({
    nombre: "AdminTest",
    apellido: "User",
    email: "admin@example.com",
    password: hashedPassword,
    id_rol: rol.id
  });

  // Generar token válido
  token = jwt.sign(
    { id: usuarioAdmin.id, email: usuarioAdmin.email, rol: rol.nombre },
    JWT_SECRET,
    { expiresIn: "2h" }
  );
});


afterAll(async () => {
  await sequelize.close();
});

describe("CRUD Usuarios", () => {
  let userId;

  it("👉 debería crear un usuario", async () => {
    const res = await request(app)
      .post("/usuarios")
      .set("Authorization", `Bearer ${token}`)
      .send({
        nombre: "Juan",
        apellido: "Perez",
        email: "juan@example.com",
        password: "123456",
        id_rol: 1
      });

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty("id");
    userId = res.body.id;
  });

  it("👉 debería obtener todos los usuarios", async () => {
    const res = await request(app)
      .get("/usuarios")
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it("👉 debería obtener un usuario por id", async () => {
    const res = await request(app)
      .get(`/usuarios/${userId}`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("id", userId);
  });

  it("👉 debería actualizar un usuario", async () => {
    const res = await request(app)
      .put(`/usuarios/${userId}`)
      .set("Authorization", `Bearer ${token}`)
      .send({ nombre: "Juan Actualizado" });

    expect(res.statusCode).toBe(200);
    expect(res.body.nombre).toBe("Juan Actualizado");
  });

  it("👉 debería eliminar un usuario", async () => {
    const res = await request(app)
      .delete(`/usuarios/${userId}`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe("Usuario eliminado");
  });
});
