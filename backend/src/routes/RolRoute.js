import { Router } from "express";
import * as rolController from "../controllers/RolController.js";
import { verifyToken } from "../middlewares/authMiddleware.js";

const router = Router();

// CRUD Roles
router.get("/", verifyToken, rolController.getRoles);
router.get("/:id", verifyToken, rolController.getRolById);
router.post("/", verifyToken, rolController.createRol);
router.put("/:id", verifyToken, rolController.updateRol);
router.delete("/:id", verifyToken, rolController.deleteRol);

export default router;
