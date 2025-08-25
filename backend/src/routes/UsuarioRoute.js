import { Router } from "express";
import * as usuarioController from "../controllers/UsuarioController.js";
import { verifyToken } from "../middlewares/authMiddleware.js";

const router = Router();

// CRUD Usuarios
router.get("/", verifyToken, usuarioController.getUsuarios);
router.get("/:id", verifyToken, usuarioController.getUsuarioById);
router.post("/", verifyToken, usuarioController.createUsuario);
router.put("/:id", verifyToken, usuarioController.updateUsuario);
router.delete("/:id", verifyToken, usuarioController.deleteUsuario);

export default router;
