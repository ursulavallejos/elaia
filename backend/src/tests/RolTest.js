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

describe("CRUD Roles", () => {
  let rolId;

  it("👉 debería crear un rol", async () => {
    const res = await request(app)
      .post("/roles")
      .set("Authorization", `Bearer ${token}`)
      .send({ nombre: "Admin" });

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty("id");
    rolId = res.body.id;
  });

  it("👉 debería obtener todos los roles", async () => {
    const res = await request(app)
      .get("/roles")
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it("👉 debería obtener un rol por id", async () => {
    const res = await request(app)
      .get(`/roles/${rolId}`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("id", rolId);
  });

  it("👉 debería actualizar un rol", async () => {
    const res = await request(app)
      .put(`/roles/${rolId}`)
      .set("Authorization", `Bearer ${token}`)
      .send({ nombre: "SuperAdmin" });

    expect(res.statusCode).toBe(200);
    expect(res.body.nombre).toBe("SuperAdmin");
  });

  it("👉 debería eliminar un rol", async () => {
    const res = await request(app)
      .delete(`/roles/${rolId}`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe("Rol eliminado");
  });
});
