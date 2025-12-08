document.addEventListener('DOMContentLoaded', function() {
    let subtotal = 0;
    let contadorItems = 0;
    let filaEnEdicion = null; 

    const selectProducto = document.getElementById('productoSelect');
    const inputUnidades = document.getElementById('unidadesInput');
    const btnAgregar = document.getElementById('btnAgregar');
    const cuerpoTabla = document.getElementById('tablaCuerpo');
    
    const celdaSubtotal = document.getElementById('celdaSubtotal');
    const celdaIva = document.getElementById('celdaIva');
    const celdaTotal = document.getElementById('celdaTotal');
    const labelPrecio = document.getElementById('precioSeleccionado');
    const filaSubtotal = document.getElementById('filaSubtotal');

    selectProducto.addEventListener('change', function() {
        const opcionSeleccionada = this.options[this.selectedIndex];
        const precio = opcionSeleccionada.getAttribute('data-precio');

        if (precio) {
            labelPrecio.textContent = `$${parseFloat(precio).toFixed(2)}`;
        } else {
            labelPrecio.textContent = "$0.00";
        }
    });

    function actualizarTotales() {
        let iva = subtotal * 0.16;
        let total = subtotal + iva;

        celdaSubtotal.textContent = `$${subtotal.toFixed(2)}`;
        celdaIva.textContent = `$${iva.toFixed(2)}`;
        celdaTotal.textContent = `$${total.toFixed(2)}`;
    }

    function limpiarCamposYResetearModo() {
        selectProducto.value = "";
        inputUnidades.value = "";
        labelPrecio.textContent = "$0.00";
        btnAgregar.textContent = 'Agregar';
        filaEnEdicion = null; 
        selectProducto.disabled = false;
    }

    btnAgregar.addEventListener('click', function() {
        
        const opcionSeleccionada = selectProducto.options[selectProducto.selectedIndex];
        const nombreProducto = opcionSeleccionada.textContent;
        const valorProducto = opcionSeleccionada.value;
        const precioUnitario = parseFloat(opcionSeleccionada.getAttribute('data-precio'));
        const unidades = parseInt(inputUnidades.value);

        if (valorProducto === "" || unidades <= 0) {
            alert("Por favor, seleccione un producto y ingrese una cantidad válida.");
            return;
        }

        const monto = precioUnitario * unidades;

        if (filaEnEdicion) {
            const montoAnterior = parseFloat(filaEnEdicion.dataset.monto);
            subtotal = subtotal - montoAnterior + monto;
            
            filaEnEdicion.dataset.monto = monto;
            filaEnEdicion.dataset.value = valorProducto;
            filaEnEdicion.dataset.unidades = unidades;

            filaEnEdicion.innerHTML = `
                <td>${filaEnEdicion.cells[0].textContent}</td> <td>${nombreProducto}</td>
                <td>$${precioUnitario.toFixed(2)}</td>
                <td>${unidades}</td>
                <td>$${monto.toFixed(2)}</td>
                <td>
                    <button class="btn-modificar">Modificar</button>
                    <button class="btn-eliminar">Eliminar</button>
                </td>
            `;

        } else {
            contadorItems++;
            const nuevaFila = document.createElement('tr');
            
            nuevaFila.dataset.monto = monto;
            nuevaFila.dataset.value = valorProducto;
            nuevaFila.dataset.unidades = unidades;
            
            nuevaFila.innerHTML = `
                <td>${contadorItems}</td>
                <td>${nombreProducto}</td>
                <td>$${precioUnitario.toFixed(2)}</td>
                <td>${unidades}</td>
                <td>$${monto.toFixed(2)}</td>
                <td>
                    <button class="btn-modificar">Modificar</button>
                    <button class="btn-eliminar">Eliminar</button>
                </td>
            `;
            cuerpoTabla.insertBefore(nuevaFila, filaSubtotal);
            subtotal += monto;
        }

        actualizarTotales();
        limpiarCamposYResetearModo();
    });

    cuerpoTabla.addEventListener('click', function(evento) {
        
        if (evento.target.classList.contains('btn-eliminar')) {
            const filaAEliminar = evento.target.closest('tr');
            
            if (filaEnEdicion === filaAEliminar) {
                limpiarCamposYResetearModo();
            }

            const montoARestar = parseFloat(filaAEliminar.dataset.monto);
            subtotal -= montoARestar;
            actualizarTotales();
            filaAEliminar.remove();

        } else if (evento.target.classList.contains('btn-modificar')) {
            
            filaEnEdicion = evento.target.closest('tr');
            
            const valorProducto = filaEnEdicion.dataset.value;
            const unidades = filaEnEdicion.dataset.unidades;
            
            selectProducto.value = valorProducto;
            inputUnidades.value = unidades;
            
            selectProducto.dispatchEvent(new Event('change'));
            
            btnAgregar.textContent = 'Guardar Cambios';

            selectProducto.disabled = true;
        }
    });
});