import { registrar } from "../modelos/auth.js";

//Elementos del DOM
const formRegistro = document.querySelector('#form-registro');
const alerta = document.querySelector('#alerta');

document.addEventListener('DOMContentLoaded', () =>{
    inicializarEventos();
});

const inicializarEventos = () => {
    formRegistro.addEventListener('submit', async (e) => {
        e.preventDefault();

        const formData = new FormData(formRegistro);

        try {
            const respuesta = await registrar(formData);

            if (respuesta.success) {
                mostrarAlerta('¡Registro exitoso! Redirigiendo al login...', 'success');
                formRegistro.reset();

                // Redireccionamos al login
                setTimeout(() => {
                    window.location.href = 'login.html';
                }, 1200);
            } else {
                mostrarAlerta(respuesta.message || 'No se puede completar el registro', 'danger');
            }
        } catch (error) {
            console.error('Error al registrar usuario', error);
            mostrarAlerta('Ocurrió un error al conectar con el servidor', 'danger');
        }
    })
};

/**
 * Define el mensaje de alerta
 * @param {*} mensaje El mensaje a mostrar
 * @param {*} tipo El tipo de alerta (primary, secondary, success, warning, danger, ...)
 */
const mostrarAlerta = (mensaje, tipo) => {
    const envoltorio = document.createElement('div');
    envoltorio.innerHTML = `
        <div class="alert alert-${tipo} alert-dismisible" role="alert">
            <div>${mensaje}</div>
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Cerrar"></button>
        </div>
    `;
    alerta.append(envoltorio);
}