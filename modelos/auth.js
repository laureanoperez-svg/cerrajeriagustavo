const URL_LOGIN = './api/login.php';
const URL_REGISTRO = './api/datos.php?tabla=usuarios&accion=insertar';

/**
 * Envía los datos del nuevo usuario para insertarlos en la BD
 * @param {FormData} datosForm 
 * @returns
 */
export const registrar = async (datosForm) => {
    const res = await fetch(URL_REGISTRO, {
        method: 'POST',
        body: datosForm
    });

    return await res.json();
}

/**
 * 
 * @param {*} datosForm 
 * @returns 
 */

export const login = async (datosForm) => {
    const res = await fetch(URL_LOGIN, {
        method: 'POST',
        body: datosForm
    });

    const data = await res.json();

    if(data.success && data.token) {
        // Guardamos el token en sessionStorage
        sessionStorage.setItem('jwt_token', data.token);
        sessionStorage.setItem('usuario_info', JSON.stringify(data.usuario));
    }

    return data;

};

export const logout = () => {
    sessionStorage.remove.Item('jwt_token');
    sessionStorage.removeItem('usuario_info');
    window.location.reload();
}