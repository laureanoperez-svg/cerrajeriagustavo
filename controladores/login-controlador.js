import { login } from "../modelos/auth.js";

//Elementos del DOM
const formLogin = document.querySelector('#form-login');
const alerta = document.querySelector('#alerta');

document.addEventListener('DOMContentLoaded', () =>{
    inicializarEventos();
});

const inicializarEventos = () => {
    formLogin.addEventListener('submit', async (e) => {
        e.preventDefault();

        const formData = new FormData(formLogin);

        try {
            const respuesta = await login(formData);

            if (respuesta.success) {
                mostrarAlerta('¡Autenticación exitosa! Redirigiendo...', 'success');

                // Redireccionamos a la pantalla principal de clientes
                setTimeout(() => {
                    window.location.href = 'index.html';
                }, 1000);
            } else {
                mostrarAlerta(respuesta.message || 'Usuario o contraseña son incorrectos.', 'danger');
            }
        } catch (error) {
            console.error('Error al iniciar sesión', error);
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