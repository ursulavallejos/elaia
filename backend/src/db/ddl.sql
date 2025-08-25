-- public."Categoria" definition



-- Drop table



-- DROP TABLE public."Categoria";



CREATE TABLE public."Categoria" (

	id serial4 NOT NULL,

	nombre varchar(255) NOT NULL,

	"createdAt" timestamptz NOT NULL,

	"updatedAt" timestamptz NOT NULL,

	CONSTRAINT "Categoria_pkey" PRIMARY KEY (id)

);





-- public."Productos" definition



-- Drop table



-- DROP TABLE public."Productos";



CREATE TABLE public."Productos" (

	id serial4 NOT NULL,

	nombre varchar(255) NOT NULL,

	descripcion text NULL,

	precio float8 NOT NULL,

	imagen_url varchar(255) NULL,

	"createdAt" timestamptz NOT NULL,

	"updatedAt" timestamptz NOT NULL,

	CONSTRAINT "Productos_pkey" PRIMARY KEY (id)

);





-- public."Rols" definition



-- Drop table



-- DROP TABLE public."Rols";



CREATE TABLE public."Rols" (

	id serial4 NOT NULL,

	nombre varchar(255) NOT NULL,

	"createdAt" timestamptz NOT NULL,

	"updatedAt" timestamptz NOT NULL,

	CONSTRAINT "Rols_pkey" PRIMARY KEY (id)

);





-- public."CategoriaProductos" definition



-- Drop table



-- DROP TABLE public."CategoriaProductos";



CREATE TABLE public."CategoriaProductos" (

	id_categoria int4 NOT NULL,

	id_producto int4 NOT NULL,

	"createdAt" timestamptz NOT NULL,

	"updatedAt" timestamptz NOT NULL,

	CONSTRAINT "CategoriaProductos_pkey" PRIMARY KEY (id_categoria, id_producto),

	CONSTRAINT "CategoriaProductos_id_categoria_fkey" FOREIGN KEY (id_categoria) REFERENCES public."Categoria"(id) ON DELETE CASCADE ON UPDATE CASCADE,

	CONSTRAINT "CategoriaProductos_id_producto_fkey" FOREIGN KEY (id_producto) REFERENCES public."Productos"(id) ON DELETE CASCADE ON UPDATE CASCADE

);





-- public."Usuarios" definition



-- Drop table



-- DROP TABLE public."Usuarios";



CREATE TABLE public."Usuarios" (

	id serial4 NOT NULL,

	nombre varchar(255) NOT NULL,

	apellido varchar(255) NOT NULL,

	email varchar(255) NOT NULL,

	"password" varchar(255) NOT NULL,

	"createdAt" timestamptz NOT NULL,

	"updatedAt" timestamptz NOT NULL,

	id_rol int4 NULL,

	CONSTRAINT "Usuarios_email_key" UNIQUE (email),

	CONSTRAINT "Usuarios_pkey" PRIMARY KEY (id),

	CONSTRAINT "Usuarios_id_rol_fkey" FOREIGN KEY (id_rol) REFERENCES public."Rols"(id) ON DELETE SET NULL ON UPDATE CASCADE

);





-- public."Pedidos" definition



-- Drop table



-- DROP TABLE public."Pedidos";



CREATE TABLE public."Pedidos" (

	id serial4 NOT NULL,

	fecha timestamptz NULL,

	"createdAt" timestamptz NOT NULL,

	"updatedAt" timestamptz NOT NULL,

	id_usuario int4 NULL,

	CONSTRAINT "Pedidos_pkey" PRIMARY KEY (id),

	CONSTRAINT "Pedidos_id_usuario_fkey" FOREIGN KEY (id_usuario) REFERENCES public."Usuarios"(id) ON DELETE SET NULL ON UPDATE CASCADE

);





-- public."DetallePedidos" definition



-- Drop table



-- DROP TABLE public."DetallePedidos";



CREATE TABLE public."DetallePedidos" (

	id serial4 NOT NULL,

	id_pedido int4 NOT NULL,

	id_producto int4 NOT NULL,

	cantidad int4 NOT NULL DEFAULT 1,

	precio_unitario float8 NOT NULL,

	"createdAt" timestamptz NOT NULL,

	"updatedAt" timestamptz NOT NULL,

	CONSTRAINT "DetallePedidos_pkey" PRIMARY KEY (id),

	CONSTRAINT "DetallePedidos_id_pedido_fkey" FOREIGN KEY (id_pedido) REFERENCES public."Pedidos"(id) ON DELETE CASCADE ON UPDATE CASCADE,

	CONSTRAINT "DetallePedidos_id_producto_fkey" FOREIGN KEY (id_producto) REFERENCES public."Productos"(id) ON DELETE CASCADE ON UPDATE CASCADE

);