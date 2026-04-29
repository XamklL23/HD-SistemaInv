const { createApp } = Vue;

const app = createApp({
    data() {
        return {
            vercion: 'inicio',
            adminTab: 'productos',
            productos: [],
            clientes: [],
            ventas: [],
            carrito: [],
            busqueda: '',
            filtroCategoria: '',
            filtroPrecioMax: 500,
            filtroTallas: [],
            ordenar: 'nuevo',
            productosFiltrados: [],
            nuevoProducto: {
                codigo: '',
                nombre: '',
                categoria: '',
                precio: 0,
                stock: 0,
                talla: '',
                color: ''
            }
        };
    },

    computed: {
        subtotal() {
            return this.carrito.reduce((sum, item) => sum + (item.precio * item.cantidad), 0);
        },
        costoEnvio() {
            return this.subtotal > 50 ? 0 : 10;
        },
        impuesto() {
            return this.subtotal * 0.08;
        },
        total() {
            return this.subtotal + this.costoEnvio + this.impuesto;
        }
    },

    methods: {
        // === Cargar datos del API ===
        cargarProductos() {
            fetch('http://localhost:8080/api/productos')
                .then(res => res.json())
                .then(data => {
                    this.productos = data;
                    this.aplicarFiltros();
                })
                .catch(err => console.error('Error cargando productos:', err));
        },

        cargarClientes() {
            fetch('http://localhost:8080/api/clientes')
                .then(res => res.json())
                .then(data => this.clientes = data)
                .catch(err => console.error('Error cargando clientes:', err));
        },

        cargarVentas() {
            fetch('http://localhost:8080/api/ventas')
                .then(res => res.json())
                .then(data => this.ventas = data)
                .catch(err => console.error('Error cargando ventas:', err));
        },

        // === Filtrado y búsqueda ===
        aplicarFiltros() {
            let filtrados = this.productos;

            // Filtro por categoría
            if (this.filtroCategoria) {
                filtrados = filtrados.filter(p => p.categoria === this.filtroCategoria);
            }

            // Filtro por precio
            filtrados = filtrados.filter(p => p.precio <= this.filtroPrecioMax);

            // Filtro por talla
            if (this.filtroTallas.length > 0) {
                filtrados = filtrados.filter(p => this.filtroTallas.includes(p.talla));
            }

            // Búsqueda
            if (this.busqueda) {
                filtrados = filtrados.filter(p =>
                    p.nombre.toLowerCase().includes(this.busqueda.toLowerCase()) ||
                    p.marca.toLowerCase().includes(this.busqueda.toLowerCase()) ||
                    p.descripcion.toLowerCase().includes(this.busqueda.toLowerCase())
                );
            }

            // Ordenamiento
            switch (this.ordenar) {
                case 'precio-asc':
                    filtrados.sort((a, b) => a.precio - b.precio);
                    break;
                case 'precio-desc':
                    filtrados.sort((a, b) => b.precio - a.precio);
                    break;
                case 'nombre':
                    filtrados.sort((a, b) => a.nombre.localeCompare(b.nombre));
                    break;
                case 'nuevo':
                    // Mantener orden original (más recientes primero)
                    break;
            }

            this.productosFiltrados = filtrados;
        },

        limpiarFiltros() {
            this.filtroCategoria = '';
            this.filtroPrecioMax = 500;
            this.filtroTallas = [];
            this.busqueda = '';
            this.ordenar = 'nuevo';
            this.aplicarFiltros();
        },

        // === Carrito ===
        agregarAlCarrito(producto) {
            const itemExistente = this.carrito.find(item => item.id === producto.id);

            if (itemExistente) {
                itemExistente.cantidad++;
            } else {
                this.carrito.push({
                    ...producto,
                    cantidad: 1
                });
            }

            // Notificación visual
            this.mostrarNotificacion(`${producto.nombre} agregado al carrito`);
        },

        aumentarCantidad(index) {
            if (this.carrito[index]) {
                this.carrito[index].cantidad++;
            }
        },

        disminuirCantidad(index) {
            if (this.carrito[index] && this.carrito[index].cantidad > 1) {
                this.carrito[index].cantidad--;
            }
        },

        eliminarDelCarrito(index) {
            this.carrito.splice(index, 1);
        },

        completarCompra() {
            if (this.carrito.length === 0) {
                alert('Tu carrito está vacío');
                return;
            }

            // Simular procesamiento de pago
            alert(`Compra completada!\nTotal: $${this.total.toFixed(2)}\n\nThanks por tu compra! 🎉`);
            
            this.carrito = [];
            this.vercion = 'inicio';
        },

        // === Admin - Productos ===
        agregarProductoAdmin() {
            if (!this.nuevoProducto.nombre) {
                alert('Ingresa el nombre del producto');
                return;
            }

            const productoDTO = {
                codigo: this.nuevoProducto.codigo || 'AUTO-' + Date.now(),
                nombre: this.nuevoProducto.nombre,
                descripcion: 'Producto agregado via admin',
                categoria: this.nuevoProducto.categoria || 'General',
                marca: 'FashionHub',
                talla: this.nuevoProducto.talla || 'M',
                color: this.nuevoProducto.color || 'Negro',
                precio: this.nuevoProducto.precio,
                stock: this.nuevoProducto.stock,
                material: 'Algodón',
                urlImagen: '',
                activo: true
            };

            fetch('http://localhost:8080/api/productos', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(productoDTO)
            })
            .then(res => res.json())
            .then(data => {
                this.productos.push(data);
                this.aplicarFiltros();
                this.nuevoProducto = {
                    codigo: '',
                    nombre: '',
                    categoria: '',
                    precio: 0,
                    stock: 0,
                    talla: '',
                    color: ''
                };
                this.mostrarNotificacion('Producto agregado exitosamente');
            })
            .catch(err => console.error('Error:', err));
        },

        eliminarProductoAdmin(id) {
            if (confirm('¿Eliminar este producto?')) {
                fetch(`http://localhost:8080/api/productos/${id}`, {
                    method: 'DELETE'
                })
                .then(() => {
                    this.productos = this.productos.filter(p => p.id !== id);
                    this.aplicarFiltros();
                    this.mostrarNotificacion('Producto eliminado');
                })
                .catch(err => console.error('Error:', err));
            }
        },

        // === Admin - Clientes ===
        eliminarClienteAdmin(id) {
            if (confirm('¿Eliminar este cliente?')) {
                fetch(`http://localhost:8080/api/clientes/${id}`, {
                    method: 'DELETE'
                })
                .then(() => {
                    this.clientes = this.clientes.filter(c => c.id !== id);
                    this.mostrarNotificacion('Cliente eliminado');
                })
                .catch(err => console.error('Error:', err));
            }
        },

        // === Utilidades ===
        verDetalle(producto) {
            alert(`
${producto.nombre}
$${producto.precio}

${producto.descripcion || 'Producto premium de moda'}

Marca: ${producto.marca}
Talla: ${producto.talla}
Color: ${producto.color}
Stock: ${producto.stock}
            `);
        },

        formatoFecha(fecha) {
            return new Date(fecha).toLocaleDateString('es-ES');
        },

        mostrarNotificacion(mensaje) {
            // Crear notificación flotante
            const notif = document.createElement('div');
            notif.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                background: #ff6b6b;
                color: white;
                padding: 16px 24px;
                border-radius: 6px;
                z-index: 9999;
                animation: slideIn 0.3s ease;
                box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            `;
            notif.textContent = mensaje;
            document.body.appendChild(notif);

            setTimeout(() => {
                notif.style.animation = 'slideOut 0.3s ease';
                setTimeout(() => notif.remove(), 300);
            }, 3000);
        }
    },

    mounted() {
        // Cargar datos cuando se monta la aplicación
        this.cargarProductos();
        this.cargarClientes();
        this.cargarVentas();

        // Agregar estilos para notificaciones
        const style = document.createElement('style');
        style.textContent = `
            @keyframes slideIn {
                from {
                    transform: translateX(400px);
                    opacity: 0;
                }
                to {
                    transform: translateX(0);
                    opacity: 1;
                }
            }

            @keyframes slideOut {
                from {
                    transform: translateX(0);
                    opacity: 1;
                }
                to {
                    transform: translateX(400px);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(style);
    },

    watch: {
        busqueda() {
            this.aplicarFiltros();
        }
    }
});

app.mount('#app');
