const { createApp } = Vue;

const app = createApp({
    data() {
        return {
            seccionActual: 'dashboard',
            productos: [],
            clientes: [],
            ventas: [],
            nuevoProducto: {
                codigo: '',
                nombre: '',
                descripcion: '',
                categoria: '',
                marca: '',
                talla: '',
                color: '',
                precio: 0,
                stock: 0,
                material: ''
            },
            nuevoCliente: {
                nombre: '',
                apellido: '',
                email: '',
                telefono: '',
                cedula: '',
                ciudad: '',
                direccion: ''
            },
            apiUrl: 'http://localhost:8080/api'
        }
    },
    methods: {
        // Cargar datos
        async cargarProductos() {
            try {
                const response = await fetch(`${this.apiUrl}/productos`);
                this.productos = await response.json();
            } catch (error) {
                console.error('Error cargando productos:', error);
            }
        },

        async cargarClientes() {
            try {
                const response = await fetch(`${this.apiUrl}/clientes`);
                this.clientes = await response.json();
            } catch (error) {
                console.error('Error cargando clientes:', error);
            }
        },

        async cargarVentas() {
            try {
                const response = await fetch(`${this.apiUrl}/ventas`);
                this.ventas = await response.json();
            } catch (error) {
                console.error('Error cargando ventas:', error);
            }
        },

        // Agregar Producto
        async agregarProducto() {
            // Validar campos requeridos
            if (!this.nuevoProducto.codigo || this.nuevoProducto.codigo.trim() === '') {
                alert('El código es requerido');
                return;
            }
            if (!this.nuevoProducto.nombre || this.nuevoProducto.nombre.trim() === '') {
                alert('El nombre es requerido');
                return;
            }
            if (!this.nuevoProducto.categoria || this.nuevoProducto.categoria.trim() === '') {
                alert('La categoría es requerida');
                return;
            }
            if (!this.nuevoProducto.talla || this.nuevoProducto.talla.trim() === '') {
                alert('La talla es requerida');
                return;
            }
            if (!this.nuevoProducto.color || this.nuevoProducto.color.trim() === '') {
                alert('El color es requerido');
                return;
            }
            if (this.nuevoProducto.precio <= 0) {
                alert('El precio debe ser mayor a 0');
                return;
            }
            if (this.nuevoProducto.stock < 0) {
                alert('El stock no puede ser negativo');
                return;
            }

            try {
                const response = await fetch(`${this.apiUrl}/productos`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(this.nuevoProducto)
                });

                if (response.ok) {
                    alert('Producto agregado exitosamente');
                    this.nuevoProducto = {
                        codigo: '',
                        nombre: '',
                        descripcion: '',
                        categoria: '',
                        marca: '',
                        talla: '',
                        color: '',
                        precio: 0,
                        stock: 0,
                        material: ''
                    };
                    this.cargarProductos();
                } else {
                    const error = await response.text();
                    alert('Error al agregar producto: ' + error);
                }
            } catch (error) {
                console.error('Error:', error);
                alert('Error al agregar producto: ' + error.message);
            }
        },

        // Agregar Cliente
        async agregarCliente() {
            try {
                const response = await fetch(`${this.apiUrl}/clientes`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(this.nuevoCliente)
                });

                if (response.ok) {
                    alert('Cliente agregado exitosamente');
                    this.nuevoCliente = {
                        nombre: '',
                        apellido: '',
                        email: '',
                        telefono: '',
                        cedula: '',
                        ciudad: '',
                        direccion: ''
                    };
                    this.cargarClientes();
                } else {
                    alert('Error al agregar cliente');
                }
            } catch (error) {
                console.error('Error:', error);
                alert('Error al agregar cliente');
            }
        },

        // Eliminar Producto
        async eliminarProducto(id) {
            if (confirm('¿Estás seguro de que deseas eliminar este producto?')) {
                try {
                    const response = await fetch(`${this.apiUrl}/productos/${id}`, {
                        method: 'DELETE'
                    });

                    if (response.ok) {
                        alert('Producto eliminado exitosamente');
                        this.cargarProductos();
                    } else {
                        alert('Error al eliminar producto');
                    }
                } catch (error) {
                    console.error('Error:', error);
                    alert('Error al eliminar producto');
                }
            }
        },

        // Eliminar Cliente
        async eliminarCliente(id) {
            if (confirm('¿Estás seguro de que deseas eliminar este cliente?')) {
                try {
                    const response = await fetch(`${this.apiUrl}/clientes/${id}`, {
                        method: 'DELETE'
                    });

                    if (response.ok) {
                        alert('Cliente eliminado exitosamente');
                        this.cargarClientes();
                    } else {
                        alert('Error al eliminar cliente');
                    }
                } catch (error) {
                    console.error('Error:', error);
                    alert('Error al eliminar cliente');
                }
            }
        },

        // Eliminar Venta
        async eliminarVenta(id) {
            if (confirm('¿Estás seguro de que deseas eliminar esta venta?')) {
                try {
                    const response = await fetch(`${this.apiUrl}/ventas/${id}`, {
                        method: 'DELETE'
                    });

                    if (response.ok) {
                        alert('Venta eliminada exitosamente');
                        this.cargarVentas();
                    } else {
                        alert('Error al eliminar venta');
                    }
                } catch (error) {
                    console.error('Error:', error);
                    alert('Error al eliminar venta');
                }
            }
        },

        // Formato de fecha
        formatoFecha(fecha) {
            const date = new Date(fecha);
            return date.toLocaleDateString('es-ES') + ' ' + date.toLocaleTimeString('es-ES');
        }
    },

    watch: {
        seccionActual(newVal) {
            if (newVal === 'productos') {
                this.cargarProductos();
            } else if (newVal === 'clientes') {
                this.cargarClientes();
            } else if (newVal === 'ventas') {
                this.cargarVentas();
            }
        }
    }
});

app.mount('#app');

// Cargar datos iniciales
setTimeout(() => {
    const appInstance = app._instance.data;
    appInstance.cargarProductos();
    appInstance.cargarClientes();
    appInstance.cargarVentas();
}, 500);
