const entrada = document.getElementById('entrada');

function agregar(valor) {
    const ultimoChar = entrada.value.slice(-1);
    if (valor === '(') {
        if ((ultimoChar >= '0' && ultimoChar <= '9') || ultimoChar === ')') {
            entrada.value += '*(';
        } else {
            entrada.value += '(';
        }
    } 
    else {
        const operadores = '+-*/';
        if (operadores.includes(valor)) {
            if (operadores.includes(ultimoChar)) {
                return;
            }
        }
        entrada.value += valor;
    }    
}

function limpiar() {
    entrada.value = '';
}

function calcular() {
    try {
        let resultado = math.evaluate(entrada.value); 
        
        if (resultado === undefined || resultado === null || isNaN(resultado)) {
            entrada.value = '¡Error!';
        } else {
            entrada.value = resultado;
        }

    } catch (error) {
        entrada.value = '¡Error!';
    }
}

function eliminarUltimo() {
    entrada.value = entrada.value.slice(0, -1);
}