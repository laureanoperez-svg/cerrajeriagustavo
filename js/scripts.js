/**
 * Cerrajería Gustavo 2 (CG2) - Lógica de Gestión de Clientes (CRUD)
 * Materia: Análisis de Sistemas Organizacionales - ISCA 4014
 * Alumno: Laureano Pérez
 */

const API_CLIENTES = './api/datos.php?tabla=clientes';

// Variables globales para control de edición y eliminación
let clienteEliminarId = null;
let listaClientesCache = [];

document.addEventListener('DOMContentLoaded', () => {
    cargarClientes();
    inicializarUsuarioLogueado();
});

/**
 * Muestra el nombre del usuario logueado en la esquina superior y gestiona el botón de acceso/salida
 */
function inicializarUsuarioLogueado() {
    const usuarioInfoStr = sessionStorage.getItem('usuario_info');
    const userBadge = document.querySelector('.user-badge');
    const userSpan = document.querySelector('.user-badge span');

    if (usuarioInfoStr) {
        try {
            const usuarioInfo = JSON.parse(usuarioInfoStr);
            if (userSpan && usuarioInfo.nombre) {
                userSpan.textContent = `¡Hola, ${usuarioInfo.nombre}!`;
            }
            if (userBadge) {
                userBadge.title = "Sesión iniciada. Haz clic para cerrar sesión o cambiar de usuario";
                userBadge.addEventListener('click', (e) => {
                    e.preventDefault();
                    if (confirm(`Hola ${usuarioInfo.nombre}. ¿Deseas cerrar sesión e ir al Login?`)) {
                        sessionStorage.removeItem('jwt_token');
                        sessionStorage.removeItem('usuario_info');
                        window.location.href = './login.html';
                    }
                });
            }
        } catch (e) {
            console.error('Error al parsear usuario_info', e);
        }
    }
}

/**
 * Consulta la API en PHP y llena la tabla de clientes
 */
async function cargarClientes() {
    const tbody = document.getElementById('tablaClientesBody');
    if (!tbody) return;

    try {
        const res = await fetch(`${API_CLIENTES}&accion=seleccionar`);
        if (!res.ok) throw new Error('Error al conectar con la API');

        const clientes = await res.json();
        listaClientesCache = Array.isArray(clientes) ? clientes : [];
        renderizarTabla(listaClientesCache);
    } catch (error) {
        console.error('Error al cargar clientes:', error);
        tbody.innerHTML = `<tr><td colspan="5" style="text-align: center; color: #d87a15; padding: 20px;">
            <strong>¡Atención!</strong> No se pudo conectar a la base de datos MySQL.<br>
            Por favor, importa el archivo <code>database.sql</code> en <strong>phpMyAdmin</strong> para ver y administrar los clientes.
        </td></tr>`;
    }
}

/**
 * Renderiza la lista de clientes en el cuerpo de la tabla
 */
function renderizarTabla(clientes) {
    const tbody = document.getElementById('tablaClientesBody');
    if (!tbody) return;

    tbody.innerHTML = '';

    // Filtrar clientes activos si se utiliza baja lógica
    const clientesVisibles = clientes.filter(c => !c.estado || c.estado === 'Activo');

    if (clientesVisibles.length === 0) {
        tbody.innerHTML = `<tr><td colspan="5" style="text-align: center; padding: 20px;">No hay clientes registrados en el sistema.</td></tr>`;
        return;
    }

    clientesVisibles.forEach(cliente => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${escaparHTML(cliente.nombre || '')}</td>
            <td>${escaparHTML(cliente.telefono || '')}</td>
            <td>${escaparHTML(cliente.vehiculo_detalle || '')}</td>
            <td>${escaparHTML(cliente.ultimo_servicio || '')}</td>
            <td class="actions-cell">
                <button class="btn-action edit" title="Modificar" onclick="prepararModalEditar(${cliente.id})">
                    <i class="fa-solid fa-pencil"></i>
                </button>
                <button class="btn-action delete" title="Eliminar" onclick="prepararModalEliminar(${cliente.id}, '${escaparJS(cliente.nombre || '')}')">
                    <i class="fa-solid fa-trash-can"></i>
                </button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

/**
 * Función de búsqueda en tiempo real (por Nombre, Teléfono, Vehículo o Servicio)
 */
function filtrarTabla() {
    const input = document.getElementById('searchInput');
    const filtro = (input ? input.value : '').toLowerCase().trim();

    if (!filtro) {
        renderizarTabla(listaClientesCache);
        return;
    }

    const filtrados = listaClientesCache.filter(cliente => {
        const nombre = (cliente.nombre || '').toLowerCase();
        const tel = (cliente.telefono || '').toLowerCase();
        const vehiculo = (cliente.vehiculo_detalle || '').toLowerCase();
        const servicio = (cliente.ultimo_servicio || '').toLowerCase();
        return nombre.includes(filtro) || tel.includes(filtro) || vehiculo.includes(filtro) || servicio.includes(filtro);
    });

    renderizarTabla(filtrados);
}

/**
 * Control de modales (Abrir y Cerrar)
 */
function abrirModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.add('active');
    }
}

function cerrarModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.remove('active');
        limpiarErroresModal(modal);
    }
}

function limpiarErroresModal(modal) {
    const inputs = modal.querySelectorAll('input');
    inputs.forEach(input => input.classList.remove('error'));
    const errores = modal.querySelectorAll('.error-msg');
    errores.forEach(err => err.style.display = 'none');
}

/**
 * Caso de Uso Alta: Valida y envía el nuevo cliente a la API MySQL
 */
async function validarNuevoCliente(event) {
    event.preventDefault();

    const nombre = document.getElementById('nuevoNombre');
    const telefono = document.getElementById('nuevoTelefono');
    const vehiculo = document.getElementById('nuevoVehiculo');
    const servicio = document.getElementById('nuevoServicio');

    let esValido = true;

    // Validación Campo Obligatorio Nombre
    if (!nombre.value.trim()) {
        mostrarErrorCampo(nombre, 'errNuevoNombre', true);
        esValido = false;
    } else {
        mostrarErrorCampo(nombre, 'errNuevoNombre', false);
    }

    // Validación Campo Obligatorio Teléfono
    if (!telefono.value.trim()) {
        mostrarErrorCampo(telefono, 'errNuevoTelefono', true);
        esValido = false;
    } else {
        mostrarErrorCampo(telefono, 'errNuevoTelefono', false);
    }

    // Validación Campo Obligatorio Vehículo / Detalle
    if (!vehiculo.value.trim()) {
        mostrarErrorCampo(vehiculo, 'errNuevoVehiculo', true);
        esValido = false;
    } else {
        mostrarErrorCampo(vehiculo, 'errNuevoVehiculo', false);
    }

    // Validación Campo Obligatorio Último Servicio
    if (!servicio.value.trim()) {
        mostrarErrorCampo(servicio, 'errNuevoServicio', true);
        esValido = false;
    } else {
        mostrarErrorCampo(servicio, 'errNuevoServicio', false);
    }

    if (!esValido) return false;

    // Construcción del FormData
    const formData = new FormData();
    formData.append('nombre', nombre.value.trim());
    formData.append('telefono', telefono.value.trim());
    formData.append('vehiculo_detalle', vehiculo.value.trim());
    formData.append('ultimo_servicio', servicio.value.trim());
    formData.append('estado', 'Activo');

    try {
        const res = await fetch(`${API_CLIENTES}&accion=insertar`, {
            method: 'POST',
            body: formData
        });
        const respuesta = await res.json();

        if (respuesta.success) {
            document.getElementById('formNuevoCliente').reset();
            cerrarModal('modalNuevo');
            await cargarClientes();
        } else {
            alert(respuesta.message || 'Error al guardar el nuevo cliente');
        }
    } catch (error) {
        console.error('Error al insertar cliente:', error);
        alert('Ocurrió un error al guardar el cliente en la base de datos.');
    }

    return false;
}

/**
 * Caso de Uso Modificación: Precarga datos en el modal de edición
 */
function prepararModalEditar(id) {
    const cliente = listaClientesCache.find(c => c.id == id);
    if (!cliente) return;

    document.getElementById('editId').value = cliente.id;
    document.getElementById('editNombre').value = cliente.nombre || '';
    document.getElementById('editTelefono').value = cliente.telefono || '';
    document.getElementById('editVehiculo').value = cliente.vehiculo_detalle || '';
    document.getElementById('editServicio').value = cliente.ultimo_servicio || '';

    limpiarErroresModal(document.getElementById('modalEditar'));
    abrirModal('modalEditar');
}

/**
 * Caso de Uso Modificación: Valida y actualiza el cliente en la API MySQL
 */
async function validarEditarCliente(event) {
    event.preventDefault();

    const id = document.getElementById('editId').value;
    const nombre = document.getElementById('editNombre');
    const telefono = document.getElementById('editTelefono');
    const vehiculo = document.getElementById('editVehiculo');
    const servicio = document.getElementById('editServicio');

    let esValido = true;

    if (!nombre.value.trim()) {
        mostrarErrorCampo(nombre, 'errEditNombre', true);
        esValido = false;
    } else {
        mostrarErrorCampo(nombre, 'errEditNombre', false);
    }

    if (!telefono.value.trim()) {
        mostrarErrorCampo(telefono, 'errEditTelefono', true);
        esValido = false;
    } else {
        mostrarErrorCampo(telefono, 'errEditTelefono', false);
    }

    if (!vehiculo.value.trim()) {
        mostrarErrorCampo(vehiculo, 'errEditVehiculo', true);
        esValido = false;
    } else {
        mostrarErrorCampo(vehiculo, 'errEditVehiculo', false);
    }

    if (!servicio.value.trim()) {
        mostrarErrorCampo(servicio, 'errEditServicio', true);
        esValido = false;
    } else {
        mostrarErrorCampo(servicio, 'errEditServicio', false);
    }

    if (!esValido) return false;

    const formData = new FormData();
    formData.append('nombre', nombre.value.trim());
    formData.append('telefono', telefono.value.trim());
    formData.append('vehiculo_detalle', vehiculo.value.trim());
    formData.append('ultimo_servicio', servicio.value.trim());

    try {
        const res = await fetch(`${API_CLIENTES}&accion=actualizar&id=${encodeURIComponent(id)}`, {
            method: 'POST',
            body: formData
        });
        const respuesta = await res.json();

        if (respuesta.success) {
            cerrarModal('modalEditar');
            await cargarClientes();
        } else {
            alert(respuesta.message || 'Error al actualizar el cliente');
        }
    } catch (error) {
        console.error('Error al actualizar cliente:', error);
        alert('Ocurrió un error al actualizar los datos en el servidor.');
    }

    return false;
}

/**
 * Caso de Uso Baja: Abre el modal de confirmación
 */
function prepararModalEliminar(id, nombre) {
    clienteEliminarId = id;
    const labelNombre = document.getElementById('deleteNombreCliente');
    if (labelNombre) {
        labelNombre.textContent = nombre ? `"${nombre}"` : '';
    }
    abrirModal('modalEliminar');
}

/**
 * Caso de Uso Baja: Confirma la eliminación física o lógica en la base de datos
 */
async function confirmarEliminar() {
    if (!clienteEliminarId) return;

    try {
        // Ejecutamos eliminación en la API
        const res = await fetch(`${API_CLIENTES}&accion=eliminar&id=${encodeURIComponent(clienteEliminarId)}`);
        const respuesta = await res.json();

        if (respuesta.success) {
            cerrarModal('modalEliminar');
            clienteEliminarId = null;
            await cargarClientes();
        } else {
            alert(respuesta.message || 'Error al dar de baja al cliente');
        }
    } catch (error) {
        console.error('Error al eliminar cliente:', error);
        alert('Ocurrió un error al procesar la baja del cliente.');
    }
}

/**
 * Muestra u oculta mensaje y estilo de error en un campo
 */
function mostrarErrorCampo(inputElement, errorSpanId, mostrar) {
    const errorSpan = document.getElementById(errorSpanId);
    if (mostrar) {
        inputElement.classList.add('error');
        if (errorSpan) errorSpan.style.display = 'block';
    } else {
        inputElement.classList.remove('error');
        if (errorSpan) errorSpan.style.display = 'none';
    }
}

/**
 * Funciones de sanitización de cadenas
 */
function escaparHTML(texto) {
    return String(texto)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}

function escaparJS(texto) {
    return String(texto)
        .replace(/\\/g, '\\\\')
        .replace(/'/g, "\\'")
        .replace(/"/g, '\\"');
}
