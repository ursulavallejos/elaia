# 🛍️ ELAIA E-commerce

Una aplicación de comercio electrónico moderna y elegante especializada en batas y cosmetiqueros. Desarrollada con React.js en el frontend y Express.js + PostgreSQL en el backend.

## ✨ Características Principales

### 🎨 Frontend
- **React.js 18** con Context API para gestión de estado
- **Bootstrap 5** para estilos responsivos y modernos
- **React Router** para navegación SPA
- **Componentes reutilizables** y hooks personalizados
- **Autenticación JWT** con persistencia de sesión
- **Carrito de compras** con gestión de estado local
- **Panel de administración** completo con CRUD operations

### 🔧 Backend
- **Express.js** con arquitectura REST API
- **Sequelize ORM** para gestión de base de datos
- **PostgreSQL** como base de datos principal
- **JWT** para autenticación y autorización
- **bcrypt** para hash seguro de contraseñas
- **Middleware** de autenticación y autorización por roles
- **Validaciones de integridad** referencial

### 🛡️ Seguridad
- Autenticación basada en tokens JWT
- Autorización por roles (Administrador/Cliente)
- Validaciones de backend para integridad de datos
- Protección contra eliminación de datos con relaciones
- Headers de seguridad y validación de entrada

## 🚀 Instalación y Configuración

### Prerrequisitos
- Node.js (v16 o superior)
- PostgreSQL (v12 o superior)
- npm o yarn

### 1. Clonar el repositorio
```bash
git clone <repository-url>
cd hito3
```

### 2. Configurar la Base de Datos
```bash
# Crear base de datos PostgreSQL
createdb elaia_ecommerce

# Ejecutar esquema DDL
psql -d elaia_ecommerce -f backend/src/db/ddl.sql

# Insertar datos iniciales
psql -d elaia_ecommerce -f backend/src/db/data.sql
```

### 3. Configurar Backend
```bash
cd backend
npm install

# Configurar variables de entorno (crear .env)
echo "DB_HOST=localhost
DB_PORT=5432
DB_NAME=elaia_ecommerce
DB_USER=tu_usuario
DB_PASSWORD=tu_password
JWT_SECRET=tu_jwt_secret_muy_seguro
PORT=4000" > .env

# Iniciar servidor backend
npm start
```

### 4. Configurar Frontend
```bash
cd frontend
npm install

# Configurar variables de entorno (crear .env)
echo "REACT_APP_API_BASE_URL=http://localhost:4000/api" > .env

# Iniciar aplicación frontend
npm start
```

## 📁 Estructura del Proyecto

```
hito3/
├── backend/
│   ├── src/
│   │   ├── controllers/     # Controladores de API
│   │   ├── models/          # Modelos de Sequelize
│   │   ├── routes/          # Rutas de Express
│   │   ├── middleware/      # Middleware personalizado
│   │   ├── db/             # Scripts de base de datos
│   │   └── index.js        # Punto de entrada del servidor
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/     # Componentes reutilizables
│   │   ├── pages/          # Páginas de la aplicación
│   │   ├── context/        # Context API (Auth, Cart)
│   │   ├── hooks/          # Hooks personalizados
│   │   ├── config/         # Configuración API centralizada
│   │   └── constants/      # Constantes (colores, etc.)
│   └── package.json
└── README.md
```

## 🎯 Funcionalidades

### 👥 Para Usuarios
- ✅ Registro e inicio de sesión
- ✅ Navegación por categorías (Batas, Cosmetiqueros)
- ✅ Carrito de compras con gestión de cantidades
- ✅ Creación de pedidos
- ✅ Historial de pedidos personales
- ✅ Perfil de usuario editable
- ✅ Páginas informativas y legales

### 🔧 Para Administradores
- ✅ Dashboard con estadísticas generales
- ✅ Gestión de usuarios y roles
- ✅ CRUD completo de productos
- ✅ Gestión de categorías
- ✅ Administración de pedidos
- ✅ Validaciones de integridad referencial
- ✅ Interfaz responsive con Bootstrap

## 🔑 Usuarios de Prueba

### Administrador
- **Email**: admin@elaia.com
- **Contraseña**: admin123

### Clientes
- **Email**: maria@example.com | **Contraseña**: cliente123
- **Email**: juan@example.com | **Contraseña**: cliente123
- **Email**: ana@example.com | **Contraseña**: cliente123
- **Email**: carlos@example.com | **Contraseña**: cliente123

## 🛠️ Tecnologías Utilizadas

### Frontend
- React.js 18
- React Router DOM
- Bootstrap 5
- React Icons
- Axios (para algunas peticiones)
- Context API

### Backend
- Express.js
- Sequelize ORM
- PostgreSQL
- bcrypt
- jsonwebtoken
- cors
- dotenv

## 🎨 Características de Diseño

### Paleta de Colores
- **Primario**: #003B5B (Azul principal)
- **Secundario**: #C2A871 (Dorado)
- **Oscuro**: #011F3A (Azul oscuro)
- **Claro**: #FFFCF8 (Blanco crema)
- **Acento**: #55142A (Rojo vino)

### Componentes Reutilizables
- Sistema de modales centralizado
- Tablas de datos con búsqueda y paginación
- Formularios con validación
- Layout responsive con navbar y footer
- Cards de productos con carrito integrado

## 📱 Responsive Design

La aplicación está completamente optimizada para:
- 📱 **Móviles** (320px+)
- 📱 **Tablets** (768px+)
- 💻 **Desktop** (1024px+)
- 🖥️ **Large screens** (1200px+)

## 🔐 Roles y Permisos

### Administrador
- Acceso completo al panel de administración
- CRUD de usuarios, roles, productos y categorías
- Visualización de todos los pedidos
- Gestión de estadísticas del sistema

### Cliente
- Navegación pública del catálogo
- Gestión personal del carrito
- Creación y visualización de pedidos propios
- Edición de perfil personal

## 🚦 Estados de la Aplicación

### Productos
- Gestión completa con validaciones
- Requiere al menos una categoría
- Protección contra eliminación si tiene pedidos

### Pedidos
- Creación desde carrito
- Cálculo automático de totales
- Historial personalizado por usuario

### Categorías y Roles
- Protección contra eliminación con dependencias
- Validaciones de integridad referencial

## 🔧 Scripts Disponibles

### Backend
```bash
npm start          # Iniciar servidor en producción
npm run dev        # Iniciar servidor en desarrollo
```

### Frontend
```bash
npm start          # Iniciar en modo desarrollo
npm run build      # Construir para producción
npm test           # Ejecutar tests
```

## 🌐 Endpoints de API

### Autenticación
- `POST /api/auth/login` - Iniciar sesión
- `POST /api/auth/register` - Registrar usuario

### Productos
- `GET /api/productos` - Listar productos
- `POST /api/productos` - Crear producto (Admin)
- `PUT /api/productos/:id` - Actualizar producto (Admin)
- `DELETE /api/productos/:id` - Eliminar producto (Admin)

### Pedidos
- `GET /api/pedidos` - Listar pedidos
- `POST /api/pedidos` - Crear pedido
- `DELETE /api/pedidos/:id` - Eliminar pedido

*Y más endpoints para usuarios, roles y categorías...*

## 🔄 Próximas Mejoras

- [ ] Sistema de pagos integrado
- [ ] Notificaciones push
- [ ] Sistema de reseñas y calificaciones
- [ ] Chat de soporte en vivo
- [ ] Integración con redes sociales
- [ ] Sistema de cupones y descuentos

## 👨‍💻 Desarrollo

Este proyecto fue desarrollado como parte de un sistema de e-commerce completo, implementando mejores prácticas de desarrollo web, arquitectura escalable y experiencia de usuario moderna.

### Características de Desarrollo
- Código documentado en español
- Arquitectura modular y escalable
- Configuración centralizada de API
- Hooks personalizados reutilizables
- Sistema de validaciones robusto
- Manejo de errores consistente

## 📄 Licencia

Este proyecto está desarrollado para fines educativos y de demostración.

---

**Desarrollado con ❤️ para ELAIA E-commerce**