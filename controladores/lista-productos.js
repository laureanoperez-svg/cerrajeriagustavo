import { seleccionarProductos, insertarProducto, actualizarProducto, eliminarProducto } from "../modelos/productos.js";

// Elementos del DOM
const alerta = document.querySelector('#alerta');
const listaProductos = document.querySelector('#lista-productos');
const btnNuevo = document.querySelector('#btn-nuevo-producto');
const dialogo = document.querySelector('#dialogo-producto');
const formProducto = document.querySelector('#form-producto');
const btnCancelar = document.querySelector('#btn-cancelar');
const dialogoTitulo = document.querySelector('#dialogo-titulo');
const inputCodigo = document.querySelector('#prod-codigo');
const inputModoEdicion = document.querySelector('#modo-edicion');
const formImagen = document.querySelector('#form-imagen');

// Variables
let productos = [];
let producto = {};
let respuesta = {};

document.addEventListener("DOMContentLoaded", ()=> {
    mostrarProductos();
    inicializarEventos();
})

const inicializarEventos = () => {
    // Abrir el modal de creación
    btnNuevo.addEventListener('click', () => {
        dialogoTitulo.textContent = 'Cargar Producto';
        inputModoEdicion.value = 'false';
        inputCodigo.disabled = false;
        formProducto.reset();
        dialogo.showModal();
    });

    // Cerrar Modal
    btnCancelar.addEventListener('click', () => {
        dialogo.close();
    });

    // Envío del formulario
    formProducto.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const id = producto.id;
        const productoData = new FormData(formProducto);

        const esEdicion = inputModoEdicion.value === 'true';

        if (esEdicion) {
            respuesta = await actualizarProducto(productoData, id);
        } else {
            respuesta = await insertarProducto(productoData);
        }

        if(respuesta.success) {
            insertarAlerta(respuesta.message, 'success');
            mostrarProductos();
            dialogo.close();
        } else {
            insertarAlerta(respuesta.message, 'warning');
            dialogo.close();
        }

    });
}

/**
 * Define el mensaje de alerta
 * @param {*} mensaje El mensaje a mostrar
 * @param {*} tipo El tipo de alerta (primary, secondary, success, warning, danger, ...)
 */
const insertarAlerta = (mensaje, tipo) => {
    const envoltorio = document.createElement('div');
    envoltorio.innerHTML = `
        <div class="alert alert-${tipo} alert-dismisible" role="alert">
            <div>${mensaje}</div>
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Cerrar"></button>
        </div>
    `;
    alerta.append(envoltorio);
}

/**
 * Obtiene los productos de la API
 * @returns productos: array de los productos
 */
const obtenerProductos = async () => {
    productos = await seleccionarProductos();
    return productos;
}

/**
 * Muestra la lista de productos
 */
const mostrarProductos = async () => {
    listaProductos.innerHTML = '';
    productos = await obtenerProductos();
    productos.map(producto => (
        listaProductos.innerHTML += `
            <article class="servicio">
                <h3><span name="codigo">${producto.codigo}</span> - <span name="nombre">${producto.nombre}</span></h3>
                <div class="servicio-icono">
                    <img src="./imagenes/productos/${producto.imagen || 'nodisponible.png'}" alt="">
                </div>
                <div style="text-align: center">
                    <img src="./imagenes/memory.svg" alt=""> | 
                    <img src="./imagenes/storage.svg" alt=""> | 
                    <img src="./imagenes/photo_camera.svg" alt=""> | 
                    <img src="./imagenes/aod.svg" alt="">
                    <p>${producto.descripcion}</p>
                </div>
                <h4>$ <span name="precio">${producto.precio}</span>.-</h4>
                <button class="boton" onclick="agregar(this)">Comprar</button>                
                <div class="admin-opciones">
                    <button class="boton-card-editar" data-id="${producto.id}">Editar</button>
                    <button class="boton-card-eliminar" data-id="${producto.id}">Eliminar</button>
                </div>
            </article>
        `
    ))
}

/**
 * 
 * @param {*} codigo - Código del producto a eliminar
 * @returns {boolean} - true si se eliminó correctamente
 */
export const eliminar = async (id) => {
    if(confirm(`¿Está seguro que desea eliminar al producto código ${id}`)) {
        respuesta = await eliminarProducto(id);
        insertarAlerta(respuesta.message, 'danger');
        mostrarProductos();
        return true;
    }
    return false;
}

/**
 * Abre el formulario con los datos del producto
 * @param {*} codigo - Código del producto a modificar
 * @returns 
 */
const abrirModalModificar = (id) => {
    producto = productos.find(p => Number(p.id) === Number(id));
    
    if(!producto) return;
    
    dialogoTitulo.textContent = 'Modificar Producto';
    inputModoEdicion.value = true;
    
    inputCodigo.value = producto.codigo;
    inputCodigo.disabled = true;
    
    document.getElementById('prod-nombre').value = producto.nombre;
    document.getElementById('prod-precio').value = producto.precio;
    document.getElementById('prod-descripcion').value = producto.descripcion;

    formImagen.src = `./imagenes/productos/${producto.imagen}`;
    
    dialogo.showModal();
}

// Delegación de eventos para los botones Editar y Eliminar
listaProductos.addEventListener('click', (e) => {
    const target = e.target;
    if(target.classList.contains('boton-card-editar')) {
        const id = target.dataset.id;
        abrirModalModificar(id);
    } else if(target.classList.contains('boton-card-eliminar')) {
        const id = target.dataset.id;
        eliminar(id);
    }
})