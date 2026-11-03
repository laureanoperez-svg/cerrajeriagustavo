function agregar(boton) {
    const articulo = boton.closest('.servicio');

    const codigo = articulo.querySelector('[name=codigo').textContent;
    const nombre = articulo.querySelector('[name=nombre').textContent;
    const precio = articulo.querySelector('[name=precio').textContent;

    const inputCantidadExistente = document.getElementById(`cantidad_${codigo}`);

    if(inputCantidadExistente) {
        let cantidadActual = parseInt(inputCantidadExistente.value);
        inputCantidadExistente.value = cantidadActual + 1;

        calcular();

        return;
    }

    const tabla = document.getElementById('lista-tabla');
    const nuevaFila = document.createElement('tr');

    nuevaFila.innerHTML = `
        <td data-label="Código">${codigo}</td>
        <td data-label="Nombre">${nombre}</td>
        <td data-label="Cantidad">
            <input 
                type="number" 
                name="cantidad" 
                id="cantidad_${codigo}"
                value="1"
                min="0"
                onchange="calcular()"
                />
        </td>
        <td data-label="Precio">$ <span name="precios" id="precio_${codigo}">${precio}</span>.- </td>
        <td data-label="Importe">$ <span name="importes" id="importe_${codigo}">${precio}</span>.-</td>
        <td><button class="boton-eliminar" onclick="eliminar(this)">X</button></td>
    `;

    tabla.appendChild(nuevaFila);

    calcular()
}

function eliminar(boton) {
    const fila = boton.closest('tr');
    fila.remove();
    calcular();
}



function calcular() {
    /* Elementos DOM */
    const cantidades = document.getElementsByName('cantidad');
    const precios = document.querySelectorAll('[name="precios"]');
    const importes = document.querySelectorAll('[name="importes"]');

    /* Variables */
    let total = 0;

    /* Cálculos */
    for(let i=0; i < cantidades.length; i++) {
        const importe = Number(cantidades[i].value) * Number(precios[i].textContent);
        total += importe;

        /* Mostrar los importes */
        importes[i].textContent = importe;
    }


    document.querySelector('#total').textContent = total;

}