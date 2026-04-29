-- ============================================
-- URBANFLOW - Base de Datos MySQL
-- ============================================

-- Crear base de datos
CREATE DATABASE IF NOT EXISTS urbanflow;
USE urbanflow;

-- Tabla: Productos
CREATE TABLE IF NOT EXISTS productos (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    codigo VARCHAR(100) UNIQUE NOT NULL,
    nombre VARCHAR(255) NOT NULL,
    descripcion TEXT,
    categoria VARCHAR(100),
    marca VARCHAR(100),
    talla VARCHAR(50),
    color VARCHAR(50),
    precio DECIMAL(10, 2) NOT NULL,
    stock INT DEFAULT 0,
    material VARCHAR(100),
    url_imagen VARCHAR(500),
    activo BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabla: Clientes
CREATE TABLE IF NOT EXISTS clientes (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    apellido VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    telefono VARCHAR(20),
    cedula VARCHAR(50) UNIQUE,
    ciudad VARCHAR(100),
    direccion VARCHAR(255),
    activo BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabla: Ventas
CREATE TABLE IF NOT EXISTS ventas (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    numero_venta VARCHAR(100) UNIQUE NOT NULL,
    cliente_id BIGINT NOT NULL,
    total DECIMAL(15, 2) NOT NULL,
    estado VARCHAR(50) DEFAULT 'PENDIENTE',
    metodo_pago VARCHAR(50),
    observaciones TEXT,
    fecha_venta TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (cliente_id) REFERENCES clientes(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabla: Detalles de Venta
CREATE TABLE IF NOT EXISTS detalles_venta (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    venta_id BIGINT NOT NULL,
    producto_id BIGINT NOT NULL,
    cantidad INT NOT NULL,
    precio_unitario DECIMAL(10, 2) NOT NULL,
    subtotal DECIMAL(15, 2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (venta_id) REFERENCES ventas(id) ON DELETE CASCADE,
    FOREIGN KEY (producto_id) REFERENCES productos(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Índices para mejorar performance
CREATE INDEX idx_productos_categoria ON productos(categoria);
CREATE INDEX idx_productos_codigo ON productos(codigo);
CREATE INDEX idx_clientes_email ON clientes(email);
CREATE INDEX idx_ventas_numero ON ventas(numero_venta);
CREATE INDEX idx_ventas_cliente ON ventas(cliente_id);
CREATE INDEX idx_detalles_venta ON detalles_venta(venta_id);

-- ============================================
-- DATOS DE PRUEBA
-- ============================================

-- Insertar productos de ejemplo
INSERT INTO productos (codigo, nombre, descripcion, categoria, marca, talla, color, precio, stock, material, activo) VALUES
('URB001', 'Camiseta Básica Premium', 'Camiseta 100% algodón, cómoda y versátil', 'Hombres', 'UrbanFlow', 'M', 'Negro', 29.99, 50, 'Algodón', true),
('URB002', 'Pantalón Skinny Fit', 'Pantalón moderno con fit ceñido', 'Hombres', 'UrbanFlow', 'L', 'Azul', 59.99, 30, 'Algodón/Poliéster', true),
('URB003', 'Sudadera Hoodie', 'Sudadera cómoda para uso diario', 'Hombres', 'UrbanFlow', 'M', 'Gris', 49.99, 25, 'Algodón/Poliéster', true),
('URB004', 'Vestido Elegante', 'Vestido casual elegante para todo tipo de ocasión', 'Mujeres', 'UrbanFlow', 'S', 'Rojo', 69.99, 15, 'Poliéster', true),
('URB005', 'Blusa de Seda', 'Blusa fina y elegante de seda natural', 'Mujeres', 'UrbanFlow', 'M', 'Blanco', 79.99, 20, 'Seda', true),
('URB006', 'Shorts Deportivos', 'Shorts cómodos para entrenar', 'Mujeres', 'UrbanFlow', 'M', 'Negro', 39.99, 40, 'Poliéster', true);

-- Insertar clientes de ejemplo
INSERT INTO clientes (nombre, apellido, email, telefono, cedula, ciudad, direccion, activo) VALUES
('Juan', 'Pérez', 'juan.perez@email.com', '+34 912 345 678', '12345678A', 'Madrid', 'Calle Principal 123', true),
('María', 'García', 'maria.garcia@email.com', '+34 913 456 789', '87654321B', 'Barcelona', 'Avenida Central 456', true),
('Carlos', 'López', 'carlos.lopez@email.com', '+34 914 567 890', '11223344C', 'Valencia', 'Plaza Mayor 789', true),
('Ana', 'Martínez', 'ana.martinez@email.com', '+34 915 678 901', '55667788D', 'Sevilla', 'Calle del Comercio 321', true),
('Luis', 'Rodríguez', 'luis.rodriguez@email.com', '+34 916 789 012', '99887766E', 'Bilbao', 'Paseo del Río 654', true);

-- Insertar ventas de ejemplo
INSERT INTO ventas (numero_venta, cliente_id, total, estado, metodo_pago, observaciones) VALUES
('VENTA-2024-001', 1, 149.97, 'COMPLETADO', 'Tarjeta Crédito', 'Primera compra'),
('VENTA-2024-002', 2, 299.95, 'COMPLETADO', 'Transferencia', 'Cliente VIP'),
('VENTA-2024-003', 3, 89.98, 'PENDIENTE', 'Tarjeta Débito', 'Pendiente de envío');

-- Insertar detalles de venta
INSERT INTO detalles_venta (venta_id, producto_id, cantidad, precio_unitario, subtotal) VALUES
(1, 1, 2, 29.99, 59.98),
(1, 2, 1, 59.99, 59.99),
(1, 3, 1, 29.99, 29.99),
(2, 4, 2, 69.99, 139.98),
(2, 5, 1, 79.99, 79.99),
(2, 6, 2, 39.99, 79.98),
(3, 1, 3, 29.99, 89.97);

-- ============================================
-- Fin del script de UrbanFlow
-- ============================================
SELECT * FROM productos;