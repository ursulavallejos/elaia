/**
 * Middleware de Autorización de Administrador para ELAIA E-commerce
 * 
 * Este middleware verifica que el usuario autenticado tenga permisos de administrador
 * para realizar operaciones sensibles como crear, actualizar o eliminar productos y categorías.
 * 
 * Funcionamiento:
 * - Se ejecuta después del middleware de autenticación (verifyToken)
 * - Verifica que el rol del usuario sea "Administrador"
 * - Bloquea el acceso si el usuario no tiene permisos suficientes
 * - Permite continuar si el usuario es administrador
 * 
 * Casos de Uso:
 * - Operaciones CRUD en productos (excepto lectura)
 * - Operaciones CRUD en categorías (excepto lectura)
 * - Gestión de usuarios y roles
 * - Cualquier operación administrativa sensible
 * 
 * @author Equipo de Desarrollo ELAIA
 * @version 1.0.0
 */

/**
 * Middleware para verificar permisos de administrador
 * 
 * Este middleware debe usarse después de verifyToken para asegurar que:
 * 1. El usuario esté autenticado (token válido)
 * 2. El usuario tenga rol de administrador
 * 
 * @param {Object} req - Objeto request de Express (debe contener req.user del middleware anterior)
 * @param {Object} res - Objeto response de Express
 * @param {Function} next - Función para continuar al siguiente middleware
 * @returns {Object} JSON response con error o continúa al siguiente middleware
 * 
 * @example
 * // Uso en rutas que requieren permisos de admin
 * router.post("/productos", verifyToken, verifyAdmin, createProducto);
 * router.put("/productos/:id", verifyToken, verifyAdmin, updateProducto);
 * router.delete("/productos/:id", verifyToken, verifyAdmin, deleteProducto);
 */
export const verifyAdmin = (req, res, next) => {
  // Verificar que existe información del usuario (del middleware verifyToken)
  if (!req.user) {
    return res.status(401).json({ 
      message: "Acceso denegado: usuario no autenticado" 
    });
  }

  // Verificar que el usuario tenga rol de administrador
  if (req.user.rol !== "Administrador") {
    return res.status(403).json({ 
      message: "Acceso denegado: se requieren permisos de administrador",
      rolActual: req.user.rol,
      rolRequerido: "Administrador"
    });
  }

  // Si es administrador, continuar al siguiente middleware o controlador
  next();
};

/**
 * Middleware combinado de autenticación y autorización de admin
 * 
 * Este middleware combina la verificación de token JWT y permisos de admin
 * en una sola función para simplificar el uso en rutas.
 * 
 * @param {Object} req - Objeto request de Express
 * @param {Object} res - Objeto response de Express  
 * @param {Function} next - Función para continuar al siguiente middleware
 * @returns {Object} JSON response con error o continúa al siguiente middleware
 * 
 * @example
 * // Uso simplificado en rutas administrativas
 * router.post("/productos", requireAdmin, createProducto);
 */
export const requireAdmin = async (req, res, next) => {
  try {
    // Importar y ejecutar verifyToken
    const { verifyToken } = await import('./authMiddleware.js');
    
    // Ejecutar verificación de token
    verifyToken(req, res, (error) => {
      if (error) return; // verifyToken ya envió la respuesta de error
      
      // Ejecutar verificación de admin
      verifyAdmin(req, res, next);
    });
  } catch (error) {
    return res.status(500).json({ 
      message: "Error en la verificación de permisos" 
    });
  }
};
