/**
 * Datos Iniciales para ELAIA E-commerce
 * 
 * Este archivo contiene los datos de semilla (seed data) para la aplicación ELAIA.
 * Incluye roles, usuarios, categorías, productos y sus relaciones.
 * 
 * Estructura de Datos:
 * 1. Roles de usuario (Admin, Cliente)
 * 2. Usuarios de prueba
 * 3. Categorías de productos
 * 4. Productos (Batas y Cosmetiqueros)
 * 5. Relaciones Categoría-Producto
 * 
 * @author Equipo de Desarrollo ELAIA
 * @version 1.0.0
 */

-- =====================================================
-- DATOS INICIALES PARA ROLES
-- =====================================================

INSERT INTO public."Rols" (id, nombre, "createdAt", "updatedAt") VALUES
(1, 'Administrador', NOW(), NOW()),
(2, 'Cliente', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- =====================================================
-- DATOS INICIALES PARA USUARIOS
-- =====================================================

-- Usuario Administrador (contraseña: admin123)
-- Contraseña hasheada con bcrypt, salt rounds 10
INSERT INTO public."Usuarios" (id, nombre, apellido, email, password, id_rol, "createdAt", "updatedAt") VALUES
(1, 'Admin', 'ELAIA', 'admin@elaia.com', '$2b$10$lDrgrmO874OMgYtVVadz1us/YFi66PXuYGgH1j/EjMlrJPBbRYgwK', 1, NOW(), NOW())
ON CONFLICT (email) DO NOTHING;

-- Usuarios Cliente de prueba
-- Contraseña para todos: cliente123
INSERT INTO public."Usuarios" (id, nombre, apellido, email, password, id_rol, "createdAt", "updatedAt") VALUES
(2, 'María', 'González', 'maria@example.com', '$2b$10$oayjH/OY9EQnpCwlgYOniuIpRZwNuGuuVbAmuebXS4GSHeh5A5JwC', 2, NOW(), NOW()),
(3, 'Juan', 'Pérez', 'juan@example.com', '$2b$10$oayjH/OY9EQnpCwlgYOniuIpRZwNuGuuVbAmuebXS4GSHeh5A5JwC', 2, NOW(), NOW()),
(4, 'Ana', 'Martínez', 'ana@example.com', '$2b$10$oayjH/OY9EQnpCwlgYOniuIpRZwNuGuuVbAmuebXS4GSHeh5A5JwC', 2, NOW(), NOW()),
(5, 'Carlos', 'López', 'carlos@example.com', '$2b$10$oayjH/OY9EQnpCwlgYOniuIpRZwNuGuuVbAmuebXS4GSHeh5A5JwC', 2, NOW(), NOW())
ON CONFLICT (email) DO NOTHING;

-- =====================================================
-- DATOS INICIALES PARA CATEGORÍAS
-- =====================================================

INSERT INTO public."Categoria" (id, nombre, "createdAt", "updatedAt") VALUES
(1, 'Batas', NOW(), NOW()),
(2, 'Cosmetiqueros', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- =====================================================
-- DATOS INICIALES PARA PRODUCTOS - BATAS
-- =====================================================

INSERT INTO public."Productos" (id, nombre, descripcion, precio, imagen_url, "createdAt", "updatedAt") VALUES
(1, 'Bata Premium Elegante', 'Bata de lujo confeccionada con materiales premium de primera calidad. Su diseño sofisticado combina elegancia y comodidad en una prenda única. Perfecta para momentos especiales o para quienes buscan lo mejor en confort y estilo. Detalles refinados y acabados impecables.', 75000, '/bata-premium.jpg', NOW(), NOW()),

(2, 'Bata Toalla Absorbente', 'Bata de toalla ultra absorbente ideal para después del baño o la ducha. Confeccionada en algodón de alta calidad que proporciona máxima absorción y suavidad. Su textura esponjosa y cómoda la convierte en la compañera perfecta para tu rutina de cuidado personal diario.', 45000, '/bata-toalla.jpg', NOW(), NOW()),

(3, 'Bata de Verano Coral', 'Bata ligera y fresca perfecta para los días de calor. Confeccionada en tela transpirable con corte holgado que permite total comodidad. Su hermoso color coral aporta vitalidad y alegría a tu día. Ideal para usar en casa durante el verano o en actividades de relajación.', 38000, '/bata-verano.jpg', NOW(), NOW())

ON CONFLICT (id) DO NOTHING;

-- =====================================================
-- DATOS INICIALES PARA PRODUCTOS - COSMETIQUEROS
-- =====================================================

INSERT INTO public."Productos" (id, nombre, descripcion, precio, imagen_url, "createdAt", "updatedAt") VALUES
(4, 'Cosmetiquero Minimalista Blanco', 'Cosmetiquero de diseño minimalista en blanco puro. Líneas limpias y funcionalidad moderna que se adapta a cualquier estilo. Interior espacioso con compartimentos organizadores para mantener tus productos de belleza perfectamente ordenados. Su elegante simplicidad lo convierte en el compañero perfecto para el día a día.', 22000, '/cosmetiquero-blanco.jpg', NOW(), NOW()),

(5, 'Cosmetiquero Natural de Lino', 'Cosmetiquero artesanal confeccionado en lino natural de alta calidad. Su textura orgánica y color neutro aportan un toque bohemio y sostenible a tu rutina de belleza. Perfecto para quienes buscan productos eco-friendly sin sacrificar estilo. Incluye cierre resistente y múltiples compartimentos.', 28000, '/cosmetiquero-lino.jpg', NOW(), NOW()),

(6, 'Cosmetiquero Vintage Rosa', 'Cosmetiquero de estilo vintage en hermoso tono rosa suave. Su diseño romántico evoca la elegancia clásica con un toque moderno. Interior forrado con material suave para proteger tus productos más delicados. Ideal para ocasiones especiales o como regalo para alguien especial.', 26000, '/cosmetiquero-rosa.jpg', NOW(), NOW())

ON CONFLICT (id) DO NOTHING;

-- =====================================================
-- RELACIONES CATEGORÍA-PRODUCTO
-- =====================================================

-- Asignar productos a sus categorías
INSERT INTO public."CategoriaProductos" (id_categoria, id_producto, "createdAt", "updatedAt") VALUES
-- Categoría Batas (id: 1)
(1, 1, NOW(), NOW()),  -- Bata Premium Elegante
(1, 2, NOW(), NOW()),  -- Bata Toalla Absorbente
(1, 3, NOW(), NOW()),  -- Bata de Verano Coral

-- Categoría Cosmetiqueros (id: 2)
(2, 4, NOW(), NOW()),  -- Cosmetiquero Minimalista Blanco
(2, 5, NOW(), NOW()),  -- Cosmetiquero Natural de Lino
(2, 6, NOW(), NOW())   -- Cosmetiquero Vintage Rosa

ON CONFLICT (id_categoria, id_producto) DO NOTHING;

-- =====================================================
-- ACTUALIZAR SECUENCIAS (AUTO-INCREMENT IDs)
-- =====================================================

-- Actualizar secuencia de Roles
SELECT setval(pg_get_serial_sequence('"Rols"', 'id'), 
    COALESCE((SELECT MAX(id) FROM public."Rols"), 1), true);

-- Actualizar secuencia de Usuarios
SELECT setval(pg_get_serial_sequence('"Usuarios"', 'id'), 
    COALESCE((SELECT MAX(id) FROM public."Usuarios"), 1), true);

-- Actualizar secuencia de Categorías
SELECT setval(pg_get_serial_sequence('"Categoria"', 'id'), 
    COALESCE((SELECT MAX(id) FROM public."Categoria"), 1), true);

-- Actualizar secuencia de Productos
SELECT setval(pg_get_serial_sequence('"Productos"', 'id'), 
    COALESCE((SELECT MAX(id) FROM public."Productos"), 1), true);