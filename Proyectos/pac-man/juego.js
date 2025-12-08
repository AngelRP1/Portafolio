const TAMANO_CELDA = 25; 
const VELOCIDAD_FANTASMA_BASE = 1.5;
const VELOCIDAD_PACMAN_BASE = 2;
const ESPERA_ENTRE_FANTASMAS = 180; 
const DURACION_ASUSTADO = 480;
const PUNTUACION_FANTASMA = 200;

// Constantes de Mapa
const ALTO_MAPA = 31 ; 
const ANCHO_MAPA = 28;
const FILA_INICIO_PACMAN = 28;
const CELDA_CENTRO_X = 13; 
const CELDA_CENTRO_Y = 15; 
const CELDA_SALIDA_Y = 12; 
const PUERTA_FANTASMA_Y = 13; 

// Códigos de estructura
const CODIGOS_ESTRUCTURA = {
    PASILLO: 0, MURO: 1, PUERTA_FANTASMA: 2, 
    GUARIDA_FANTASMA: 3, TUNEL: 4, INICIO_PACMAN: 5
};
// Códigos de ítems y puntuación
const CODIGOS_ITEM = {
    VACIO: 0, BOLITA: 1, BOLITA_PODER: 2, FRUTA: 3
};
const PUNTUACION_BOLITA = 10;
const PUNTUACION_BOLITA_PODER = 50;

// Constantes de estilo
const COLOR_MURO = '#0000FF'; 
const GROSOR_LINEA_MURO = 2; 
const RADIO_ESQUINA_MURO = 3;    

//Constantes de sonido
const soundEat = new Audio('Sounds/PacmanWakaWaka.mp3');
const soundGhost = new Audio('Sounds/Ghost.mp3');
const soundPellet = new Audio('Sounds/PacmanPellet.mp3');
const soundIntro = new Audio('Sounds/PacmanIntro.mp3');
const soundEatGhost = new Audio('Sounds/PacmanEatGhost.mp3');
const soundDeath = new Audio('Sounds/PacmanDeath.mp3');

soundEat.volume = 1;
soundIntro.volume = 1;
soundGhost.volume = 0.7;
soundPellet.volume = 0.7;

const matriz_estructura_pacman = [
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,1,1,1,1,0,1,1,1,1,1,0,1,1,0,1,1,1,1,1,0,1,1,1,1,0,1],
    [1,0,1,1,1,1,0,1,1,1,1,1,0,1,1,0,1,1,1,1,1,0,1,1,1,1,0,1],
    [1,0,1,1,1,1,0,1,1,1,1,1,0,1,1,0,1,1,1,1,1,0,1,1,1,1,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,1,1,1,1,0,1,1,0,1,1,1,1,1,1,1,1,0,1,1,0,1,1,1,1,0,1],
    [1,0,1,1,1,1,0,1,1,0,1,1,1,1,1,1,1,1,0,1,1,0,1,1,1,1,0,1],
    [1,0,0,0,0,0,0,1,1,0,0,0,0,1,1,0,0,0,0,1,1,0,0,0,0,0,0,1],
    [1,1,1,1,1,1,0,1,1,1,1,1,0,1,1,0,1,1,1,1,1,0,1,1,1,1,1,1],
    [4,4,4,4,4,1,0,1,1,1,1,1,0,1,1,0,1,1,1,1,1,0,1,4,4,4,4,4],
    [4,4,4,4,4,1,0,1,1,0,0,0,0,0,0,0,0,0,0,1,1,0,1,4,4,4,4,4],
    [1,1,1,1,1,1,0,1,1,0,1,1,1,2,2,1,1,1,0,1,1,0,1,1,1,1,1,1],
    [4,4,4,4,4,4,0,0,0,0,1,3,3,3,3,3,3,1,0,0,0,0,4,4,4,4,4,4],
    [1,1,1,1,1,1,0,1,1,0,1,3,3,3,3,3,3,1,0,1,1,0,1,1,1,1,1,1],
    [4,4,4,4,4,1,0,1,1,0,1,1,1,1,1,1,1,1,0,1,1,0,1,4,4,4,4,4],
    [4,4,4,4,4,1,0,1,1,0,0,0,0,0,0,0,0,0,0,1,1,0,1,4,4,4,4,4],
    [1,1,1,1,1,1,0,1,1,0,1,1,1,1,1,1,1,1,0,1,1,0,1,1,1,1,1,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,1,1,1,1,0,1,1,1,1,1,0,1,1,0,1,1,1,1,1,0,1,1,1,1,0,1],
    [1,0,1,1,1,1,0,1,1,1,1,1,0,1,1,0,1,1,1,1,1,0,1,1,1,1,0,1],
    [1,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,1],
    [1,1,1,0,1,1,0,1,1,0,1,1,1,1,1,1,1,1,0,1,1,0,1,1,0,1,1,1],
    [1,1,1,0,1,1,0,1,1,0,1,1,1,1,1,1,1,1,0,1,1,0,1,1,0,1,1,1],
    [1,0,0,0,0,0,0,1,1,0,0,0,0,1,1,0,0,0,0,1,1,0,0,0,0,0,0,1],
    [1,0,1,1,1,1,1,1,1,1,1,1,0,1,1,0,1,1,1,1,1,1,1,1,1,1,0,1],
    [1,0,1,1,1,1,1,1,1,1,1,1,0,1,1,0,1,1,1,1,1,1,1,1,1,1,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]
];

const matriz_items_pacman_ORIGINAL = [
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,1,1,1,1,1,1,1,1,1,1,1,1,0,0,1,1,1,1,1,1,1,1,1,1,1,1,0],
    [0,2,0,0,0,0,1,0,0,0,0,0,1,0,0,1,0,0,0,0,0,1,0,0,0,0,2,0],
    [0,1,0,0,0,0,1,0,0,0,0,0,1,0,0,1,0,0,0,0,0,1,0,0,0,0,1,0],
    [0,1,0,0,0,0,1,0,0,0,0,0,1,0,0,1,0,0,0,0,0,1,0,0,0,0,1,0],
    [0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0],
    [0,1,0,0,0,0,1,0,0,1,0,0,0,0,0,0,0,0,1,0,0,1,0,0,0,0,1,0],
    [0,1,0,0,0,0,1,0,0,1,0,0,0,0,0,0,0,0,1,0,0,1,0,0,0,0,1,0],
    [0,1,1,1,1,1,1,0,0,1,1,1,1,0,0,1,1,1,1,0,0,1,1,1,1,1,1,0],
    [0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0],
    [4,4,4,4,4,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,4,4,4,4,4],
    [4,4,4,4,4,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,4,4,4,4,4],
    [4,4,4,4,4,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,4,4,4,4,4],
    [4,4,4,4,4,0,1,1,1,0,0,0,0,0,0,0,0,0,0,1,1,1,0,4,4,4,4,4],
    [0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0],
    [0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0],
    [0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0],
    [0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0],
    [0,1,1,1,1,1,1,1,1,1,1,1,1,0,0,1,1,1,1,1,1,1,1,1,1,1,1,0],
    [0,1,0,0,0,0,1,0,0,0,0,0,1,0,0,1,0,0,0,0,0,1,0,0,0,0,1,0],
    [0,1,0,0,0,0,1,0,0,0,0,0,1,0,0,1,0,0,0,0,0,1,0,0,0,0,1,0],
    [0,1,1,1,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,1,1,1,0],
    [0,0,0,1,0,0,1,0,0,1,0,0,0,0,0,0,0,0,1,0,0,1,0,0,1,0,0,0],
    [0,0,0,1,0,0,1,0,0,1,0,0,0,0,0,0,0,0,1,0,0,1,0,0,1,0,0,0],
    [0,1,1,1,1,1,1,0,0,1,1,1,1,0,0,1,1,1,1,0,0,1,1,1,1,1,1,0],
    [0,1,0,0,0,0,0,0,0,0,0,0,1,0,0,1,0,0,0,0,0,0,0,0,0,0,1,0],
    [0,1,0,0,0,0,0,0,0,0,0,0,1,0,0,1,0,0,0,0,0,0,0,0,0,0,1,0],
    [0,2,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,2,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
];

// --- VARIABLES DE ESTADO DE JUEGO ---

const lienzo = document.getElementById('pacmanCanvas');
const ctx = lienzo.getContext('2d');
const scoreElement = document.getElementById('score');
const livesElement = document.getElementById('lives');
const messagesElement = document.getElementById('game-messages');

let matriz_items_pacman; 
let puntuacion = 0; 
let vidas = 3;
let estadoJuego = 'MENU_INICIO';
let pacman; 
let fantasmas = []; 
let frightenedTimer = 0;
let puntuacionFantasmaComido = 0;
let bolitasRestantes = 0;

function obtenerPosicionCuadricula(pixelX, pixelY) {
    return {
        x: Math.floor(pixelX / TAMANO_CELDA),
        y: Math.floor(pixelY / TAMANO_CELDA)
    };
}

function clampObjetivo(x, y) {
    const nx = Math.max(0, Math.min(ANCHO_MAPA - 1, x));
    const ny = Math.max(0, Math.min(ALTO_MAPA - 1, y));
    return { x: nx, y: ny };
}

class Fantasma {
    constructor(nombre, color, velocidad, retrasoSalida) {
        this.nombre = nombre;
        this.inicioX = CELDA_CENTRO_X;
        this.inicioY = CELDA_CENTRO_Y;
        this.gridX = this.inicioX;
        this.gridY = this.inicioY;
        this.pixelX = this.inicioX * TAMANO_CELDA + TAMANO_CELDA / 2;
        this.pixelY = this.inicioY * TAMANO_CELDA + TAMANO_CELDA / 2;
        this.color = color;
        this.velocidadBase = velocidad;
        this.velocidad = velocidad;
        this.direccion = 'ARRIBA';
        this.siguienteDireccion = 'ARRIBA';
        this.enGuarida = true;
        this.retrasoSalida = retrasoSalida;
        this.estaAlineado = true;
        this.modo = 'PERSEGUIR'; 

        // Para detectar stuck
        this.lastPixelX = this.pixelX;
        this.lastPixelY = this.pixelY;
        this.stuckCounter = 0;
    }

    puedeMoverseA(gridX, gridY) {
        if (gridY === 14 && (gridX < 0 || gridX >= ANCHO_MAPA)) return true; 
        if (gridY < 0 || gridY >= ALTO_MAPA || gridX < 0 || gridX >= ANCHO_MAPA) return false;
        const celda = matriz_estructura_pacman[gridY][gridX];
        if (this.enGuarida || this.modo === 'RETORNANDO') {
            return celda === CODIGOS_ESTRUCTURA.GUARIDA_FANTASMA ||
                    celda === CODIGOS_ESTRUCTURA.PUERTA_FANTASMA ||
                    celda === CODIGOS_ESTRUCTURA.PASILLO;
        } else {
            return celda !== CODIGOS_ESTRUCTURA.MURO &&
                    celda !== CODIGOS_ESTRUCTURA.PUERTA_FANTASMA &&
                    celda !== CODIGOS_ESTRUCTURA.GUARIDA_FANTASMA;
        }
    }

    calcularObjetivo() {
        if (this.enGuarida && this.modo !== 'RETORNANDO') return clampObjetivo(CELDA_CENTRO_X, CELDA_SALIDA_Y);
        if (this.modo === 'RETORNANDO') return clampObjetivo(CELDA_CENTRO_X, CELDA_CENTRO_Y);
        if (this.modo === 'ASUSTADO') return clampObjetivo(1, 1);

        const pacmanGridX = pacman.gridX, pacmanGridY = pacman.gridY, pacmanDir = pacman.direccion;
        switch (this.nombre) {
            case 'Blinky': return clampObjetivo(pacmanGridX, pacmanGridY);
            case 'Pinky': {
                let tx = pacmanGridX, ty = pacmanGridY, off = 4;
                if (pacmanDir === 'ARRIBA') { ty -= off; tx -= off; } 
                else if (pacmanDir === 'ABAJO') ty += off;
                else if (pacmanDir === 'IZQUIERDA') tx -= off;
                else if (pacmanDir === 'DERECHA') tx += off;
                return clampObjetivo(tx, ty);
            }
            case 'Inky': {
                const blinky = fantasmas.find(f => f.nombre === 'Blinky');
                if (!blinky) return clampObjetivo(pacmanGridX, pacmanGridY);
                let pX = pacmanGridX, pY = pacmanGridY, off = 2;
                if (pacmanDir === 'ARRIBA') { pY -= off; pX -= off; }
                else if (pacmanDir === 'ABAJO') pY += off;
                else if (pacmanDir === 'IZQUIERDA') pX -= off;
                else if (pacmanDir === 'DERECHA') pX += off;
                const dx = pX - blinky.gridX, dy = pY - blinky.gridY;
                return clampObjetivo(blinky.gridX + 2 * dx, blinky.gridY + 2 * dy);
            }
            case 'Clyde': {
                const dist = Math.hypot(pacmanGridX - this.gridX, pacmanGridY - this.gridY);
                if (dist > 8) return clampObjetivo(pacmanGridX, pacmanGridY);
                return clampObjetivo(0, ALTO_MAPA - 1);
            }
        }
    }

    // Elige cualquier dirección válida, incluyendo reversa (útil como fallback)
    _elegirAnyValidDirection() {
        const dirs = ['ARRIBA', 'ABAJO', 'IZQUIERDA', 'DERECHA'];
        const posibles = [];
        for (const dir of dirs) {
            let nx = this.gridX, ny = this.gridY;
            if (dir === 'ARRIBA') ny--; else if (dir === 'ABAJO') ny++;
            else if (dir === 'IZQUIERDA') nx--; else if (dir === 'DERECHA') nx++;
            if (this.puedeMoverseA(nx, ny)) posibles.push(dir);
        }
        if (posibles.length === 0) return this.direccion;
        return posibles[Math.floor(Math.random() * posibles.length)];
    }

elegirNuevaDireccion() {
        const direcciones = ['ARRIBA', 'ABAJO', 'IZQUIERDA', 'DERECHA'];
        // Objeto para obtener la dirección opuesta
        const reversa = { 'ARRIBA':'ABAJO', 'ABAJO':'ARRIBA', 'IZQUIERDA':'DERECHA', 'DERECHA':'IZQUIERDA' };

        if (this.modo === 'ASUSTADO') {
            const direccionesValidas = [];
            
            // 1. Encontrar todas las direcciones posibles que no sean la reversa
            for (const dir of direcciones) {
                let nx = this.gridX, ny = this.gridY;
                if (dir === 'ARRIBA') ny--; else if (dir === 'ABAJO') ny++;
                else if (dir === 'IZQUIERDA') nx--; else if (dir === 'DERECHA') nx++;
                
                // SOLO agrega direcciones válidas. En modo ASUSTADO, la reversa SÍ está prohibida.
                if (this.puedeMoverseA(nx, ny) && dir !== reversa[this.direccion]) {
                    direccionesValidas.push(dir);
                }
            }
            
            // 2. Si no hay opciones que no sean la reversa (está en un callejón sin salida)
            if (direccionesValidas.length === 0) {
                // Forzar la dirección opuesta si es la única válida (la única manera de salir)
                const revDir = reversa[this.direccion];
                let nx = this.gridX, ny = this.gridY;
                if (revDir === 'ARRIBA') ny--; else if (revDir === 'ABAJO') ny++;
                else if (revDir === 'IZQUIERDA') nx--; else if (revDir === 'DERECHA') nx++;
                
                if (this.puedeMoverseA(nx, ny)) {
                    direccionesValidas.push(revDir);
                }
            }
            
            // 3. Elegir una al azar de las opciones disponibles
            if (direccionesValidas.length > 0) {
                // Elegir una dirección al azar de todas las válidas (que no sean la reversa)
                this.siguienteDireccion = direccionesValidas[Math.floor(Math.random() * direccionesValidas.length)];
            } else {
                // Esto nunca debería ocurrir si el mapa está bien hecho, pero como fallback
                this.siguienteDireccion = this.direccion; 
            }
            return;
        }

        const objetivo = this.calcularObjetivo();
        let mejorDist = Infinity;
        let candidatos = [];
        for (const dir of direcciones) {
            if ((dir === 'ARRIBA' && this.direccion === 'ABAJO') ||
                (dir === 'ABAJO' && this.direccion === 'ARRIBA') ||
                (dir === 'IZQUIERDA' && this.direccion === 'DERECHA') ||
                (dir === 'DERECHA' && this.direccion === 'IZQUIERDA')) continue;

            let nx = this.gridX, ny = this.gridY;
            if (dir === 'ARRIBA') ny--; else if (dir === 'ABAJO') ny++;
            else if (dir === 'IZQUIERDA') nx--; else if (dir === 'DERECHA') nx++;

            if (!this.puedeMoverseA(nx, ny)) continue;

            const dist = Math.hypot(objetivo.x - nx, objetivo.y - ny);
            if (dist + 1e-6 < mejorDist) {
                mejorDist = dist;
                candidatos = [dir];
            } else if (Math.abs(dist - mejorDist) < 1e-6) {
                candidatos.push(dir);
            }
        }

        if (candidatos.length > 0) {
            this.siguienteDireccion = candidatos[Math.floor(Math.random() * candidatos.length)];
            return;
        }

        this.siguienteDireccion = this._elegirAnyValidDirection();
    }

    actualizar() {
        if (this.retrasoSalida > 0) { this.retrasoSalida--; return; }

        if (this.modo === 'ASUSTADO') this.velocidad = this.velocidadBase;
        else if (this.modo === 'RETORNANDO') this.velocidad = this.velocidadBase * 3;
        else this.velocidad = this.velocidadBase;

        const { x: currentGridX, y: currentGridY } = obtenerPosicionCuadricula(this.pixelX, this.pixelY);
        this.gridX = currentGridX; this.gridY = currentGridY;

        if (this.enGuarida) {
            const centroXPixel = CELDA_CENTRO_X * TAMANO_CELDA + TAMANO_CELDA / 2;
            const salidaYPixel = (this.modo === 'RETORNANDO') ? (CELDA_CENTRO_Y * TAMANO_CELDA + TAMANO_CELDA / 2) : (CELDA_SALIDA_Y * TAMANO_CELDA + TAMANO_CELDA / 2);
            this.pixelX = centroXPixel;
            if (Math.abs(this.pixelY - salidaYPixel) < this.velocidad) this.pixelY = salidaYPixel;
            else if (this.pixelY > salidaYPixel) this.pixelY -= this.velocidad;
            else if (this.pixelY < salidaYPixel) this.pixelY += this.velocidad;

            if (this.pixelY === salidaYPixel) {
                if (this.modo === 'RETORNANDO') { this.modo = 'PERSEGUIR'; this.direccion = 'ARRIBA'; }
                else { this.enGuarida = false; this.direccion = 'ARRIBA'; }
            }
            this.lastPixelX = this.pixelX; this.lastPixelY = this.pixelY; this.stuckCounter = 0;
            return;
        }

        const mediaCelda = TAMANO_CELDA / 2;
        const alineadoX = Math.abs(this.pixelX - (currentGridX * TAMANO_CELDA + mediaCelda)) < Math.max(this.velocidad, 1);
        const alineadoY = Math.abs(this.pixelY - (currentGridY * TAMANO_CELDA + mediaCelda)) < Math.max(this.velocidad, 1);

        if (alineadoX && alineadoY) {
            this.pixelX = currentGridX * TAMANO_CELDA + mediaCelda;
            this.pixelY = currentGridY * TAMANO_CELDA + mediaCelda;
            this.estaAlineado = true;
            this.elegirNuevaDireccion();
            this.direccion = this.siguienteDireccion;
        } else {
            this.estaAlineado = false;
        }

        let moverX = 0, moverY = 0;
        if (this.direccion === 'ARRIBA') moverY = -this.velocidad;
        else if (this.direccion === 'ABAJO') moverY = this.velocidad;
        else if (this.direccion === 'IZQUIERDA') moverX = -this.velocidad;
        else if (this.direccion === 'DERECHA') moverX = this.velocidad;

        let siguienteGridX = currentGridX, siguienteGridY = currentGridY;
        if (this.direccion === 'ARRIBA') siguienteGridY--;
        else if (this.direccion === 'ABAJO') siguienteGridY++;
        else if (this.direccion === 'IZQUIERDA') siguienteGridX--;
        else if (this.direccion === 'DERECHA') siguienteGridX++;

        if (!this.puedeMoverseA(siguienteGridX, siguienteGridY) && this.estaAlineado) {
            this.elegirNuevaDireccion();
            this.direccion = this.siguienteDireccion;

            moverX = moverY = 0;
            if (this.direccion === 'ARRIBA') moverY = -this.velocidad;
            else if (this.direccion === 'ABAJO') moverY = this.velocidad;
            else if (this.direccion === 'IZQUIERDA') moverX = -this.velocidad;
            else if (this.direccion === 'DERECHA') moverX = this.velocidad;
        }

        this.pixelX += moverX;
        this.pixelY += moverY;

        if (currentGridY === 14) {
            const maxPixel = ANCHO_MAPA * TAMANO_CELDA - mediaCelda;
            if (this.pixelX <= -mediaCelda) this.pixelX = maxPixel;
            else if (this.pixelX >= ANCHO_MAPA * TAMANO_CELDA + mediaCelda) this.pixelX = mediaCelda;
        }

        const dx = Math.abs(this.pixelX - this.lastPixelX);
        const dy = Math.abs(this.pixelY - this.lastPixelY);
        // Umbral de movimiento mínimo.
        const movementThreshold = 0.4; 

        if ((dx < movementThreshold && dy < movementThreshold) && !this.enGuarida && this.retrasoSalida <= 0) {
            // Acelerar el contador si está lento (común en modo ASUSTADO)
            this.stuckCounter += (this.velocidad < 1) ? 2 : 1; 
        } else {
            this.stuckCounter = 0;
        }
        this.lastPixelX = this.pixelX; this.lastPixelY = this.pixelY;

        // Si el contador excede el límite (ej. 8 ciclos sin movimiento suficiente)
        if (this.stuckCounter > 2) { 

            // 1. Forzar la alineación perfecta al centro de la celda (el "despegue")
            this.pixelX = this.gridX * TAMANO_CELDA + mediaCelda;
            this.pixelY = this.gridY * TAMANO_CELDA + mediaCelda;
            
            // 2. Forzar una nueva dirección válida.
            const nueva = this._elegirAnyValidDirection();
            this.direccion = nueva;
            this.siguienteDireccion = nueva;
            this.stuckCounter = 0;
        }
    }

    dibujar() {
        const radio = TAMANO_CELDA / 2 - 1;
        const x = this.pixelX, y = this.pixelY;
        if (this.modo === 'RETORNANDO') {
            ctx.fillStyle = 'white';
            ctx.beginPath();
            ctx.arc(x - 4, y - 2, 3, 0, Math.PI * 2);
            ctx.arc(x + 4, y - 2, 3, 0, Math.PI * 2);
            ctx.fill();
            return;
        }

        let color = this.color;
        if (this.modo === 'ASUSTADO') {
            color = (frightenedTimer < 120 && Math.floor(frightenedTimer / 10) % 2 === 0) ? '#FFFFFF' : '#0000FF';
        }

        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.arc(x, y, radio, Math.PI, 0, false);
        ctx.lineTo(x + radio, y + radio);
        ctx.lineTo(x + radio - 4, y + radio - 4);
        ctx.lineTo(x + radio - 8, y + radio);
        ctx.lineTo(x + radio - 12, y + radio - 4);
        ctx.lineTo(x - radio + 12, y + radio);
        ctx.lineTo(x - radio + 8, y + radio - 4);
        ctx.lineTo(x - radio + 4, y + radio);
        ctx.lineTo(x - radio, y + radio - 4);
        ctx.closePath();
        ctx.fill();

        ctx.fillStyle = 'white';
        ctx.beginPath();
        ctx.arc(x - 4, y - 2, 2, 0, Math.PI * 2);
        ctx.arc(x + 4, y - 2, 2, 0, Math.PI * 2);
        ctx.fill();
    }
}

// --- LÓGICA DE JUEGO PAC-MAN ---

function iniciarJuego() {
    puntuacion = 0;
    vidas = 3;
    try { soundGhost.pause(); } catch(e){}
    try { soundPellet.pause(); } catch(e){}
    try { soundEat.pause(); } catch(e){}
    try { soundIntro.pause(); } catch(e){}
    try { soundDeath.pause(); } catch(e){}
    soundIntro.onended = null;
    soundEatGhost.onended = null;
    reiniciarNivel(true);
    actualizarHUD();
}

function reiniciarNivel(reiniciarItems = false) {
    pacman = { 
        gridX: 13, gridY: FILA_INICIO_PACMAN, 
        pixelX: 13 * TAMANO_CELDA + TAMANO_CELDA / 2, 
        pixelY: FILA_INICIO_PACMAN * TAMANO_CELDA + TAMANO_CELDA / 2, 
        direccion: 'IZQUIERDA', siguienteDireccion: 'IZQUIERDA', 
        velocidad: VELOCIDAD_PACMAN_BASE, alineado: true,
        ratioBocaAbierta: 1, 
        velocidadBoca: 0.2, 
        contadorAnimacion: 0
    };
    
    fantasmas = [
        new Fantasma('Blinky', 'red', VELOCIDAD_FANTASMA_BASE, 0), 
        new Fantasma('Pinky', 'pink', VELOCIDAD_FANTASMA_BASE, ESPERA_ENTRE_FANTASMAS), 
        new Fantasma('Inky', 'cyan', VELOCIDAD_FANTASMA_BASE, ESPERA_ENTRE_FANTASMAS * 2), 
        new Fantasma('Clyde', 'orange', VELOCIDAD_FANTASMA_BASE, ESPERA_ENTRE_FANTASMAS * 3)
    ];
    
    if (reiniciarItems) {
        matriz_items_pacman = matriz_items_pacman_ORIGINAL.map(arr => [...arr]);
        bolitasRestantes = 0;
        for (let y = 0; y < ALTO_MAPA; y++) {
            for (let x = 0; x < ANCHO_MAPA; x++) {
                if (matriz_items_pacman[y][x] === CODIGOS_ITEM.BOLITA || matriz_items_pacman[y][x] === CODIGOS_ITEM.BOLITA_PODER) {
                    bolitasRestantes++;
                }
            }
        }
    }

    frightenedTimer = 0;
    estadoJuego = 'PAUSA_INICIO';
    mostrarMensaje("¡LISTO!");

    // Reproducir intro una sola vez y arrancar al terminar
    if (reiniciarItems) {
        soundIntro.currentTime = 0;
        soundIntro.play();
        soundIntro.onended = () => {
            if (estadoJuego !== 'GAME_OVER') {
                estadoJuego = 'JUGANDO';
                soundGhost.play();
                mostrarMensaje("", 1);
            }
        };
    } else {
        setTimeout(() => {
            if (estadoJuego !== 'GAME_OVER') {
                estadoJuego = 'JUGANDO';
                soundGhost.play();
                mostrarMensaje("", 1);
            }
        }, 2000);
    }
}

function pacmanMuere() {
    try { soundGhost.pause(); } catch(e){}
    try { soundPellet.pause(); } catch(e){}
    try { soundEat.pause(); } catch(e){}
    soundDeath.currentTime = 0;
    soundDeath.play();

    estadoJuego = 'ANIMACION_MUERTE';
    vidas--;
    actualizarHUD();
    setTimeout(() => {
        if (vidas <= 0) {
            estadoJuego = 'GAME_OVER';
            mostrarMensaje("GAME OVER");
        } else {
            reiniciarNivel(false);
        }
    }, 1500);
}

function comerFantasma(fantasma) {
    try { soundPellet.pause(); } catch(e){}
    soundEatGhost.currentTime = 0;
    soundEatGhost.play();

    soundEatGhost.onended = () => {
        if (frightenedTimer > 0 && estadoJuego === 'JUGANDO') {
            soundPellet.play();
        }
    };

    puntuacion += puntuacionFantasmaComido;
    fantasma.modo = 'RETORNANDO';
    fantasma.enGuarida = true;
    puntuacionFantasmaComido *= 2;
    actualizarHUD();
}

function verificarColisiones() {
    for (const fantasma of fantasmas) {
        const diffX = pacman.pixelX - fantasma.pixelX;
        const diffY = pacman.pixelY - fantasma.pixelY;
        const distancia = Math.sqrt(diffX * diffX + diffY * diffY);

        if (distancia < TAMANO_CELDA * 0.75) { 
            if (fantasma.modo === 'PERSEGUIR') {
                pacmanMuere();
                return;
            } 
            else if (fantasma.modo === 'ASUSTADO') {
                comerFantasma(fantasma);
            }
        }
    }
}

function esMuro(x, y) {
    if (x < 0 || x >= ANCHO_MAPA || y < 0 || y >= ALTO_MAPA) return false;
    const celda = matriz_estructura_pacman[y][x];
    return celda === CODIGOS_ESTRUCTURA.MURO || celda === CODIGOS_ESTRUCTURA.PUERTA_FANTASMA;
}

function puedeMoverseA(gridX, gridY) {
    if (gridY === 14 && (gridX < 0 || gridX >= ANCHO_MAPA)) return true; // Túnel
    if (gridY < 0 || gridY >= ALTO_MAPA || gridX < 0 || gridX >= ANCHO_MAPA) return false; 
    const celda = matriz_estructura_pacman[gridY][gridX];
    return celda !== CODIGOS_ESTRUCTURA.MURO && celda !== CODIGOS_ESTRUCTURA.PUERTA_FANTASMA;
}

function verificarYComerItem(gridX, gridY) {
    if (!matriz_items_pacman) return false;
    if (gridY < 0 || gridY >= ALTO_MAPA || gridX < 0 || gridX >= ANCHO_MAPA) return false; 
    const codigoItem = matriz_items_pacman[gridY][gridX];
    
    if (codigoItem !== CODIGOS_ITEM.VACIO) {
        if (codigoItem === CODIGOS_ITEM.BOLITA) { 
            puntuacion += PUNTUACION_BOLITA; 
            bolitasRestantes--;
            soundEat.currentTime = 0;
            soundEat.play();
        } 
        else if (codigoItem === CODIGOS_ITEM.BOLITA_PODER) { 
            puntuacion += PUNTUACION_BOLITA_PODER; 
            bolitasRestantes--;
            try { soundGhost.pause(); } catch(e) {}
            if (!soundPellet.paused) { soundPellet.pause(); soundPellet.currentTime = 0; }
            try { soundEat.pause(); soundEat.currentTime = 0; } catch(e){}

            soundPellet.currentTime = 0;
            soundPellet.play();

            frightenedTimer = DURACION_ASUSTADO;
            puntuacionFantasmaComido = PUNTUACION_FANTASMA;
            fantasmas.forEach(f => {
                if (f.modo !== 'RETORNANDO') {
                    f.modo = 'ASUSTADO';
                    const reverse = { 'ARRIBA':'ABAJO', 'ABAJO':'ARRIBA', 'IZQUIERDA':'DERECHA', 'DERECHA':'IZQUIERDA' };
                    f.direccion = reverse[f.direccion] || f.direccion;
                    f.siguienteDireccion = reverse[f.siguienteDireccion] || f.siguienteDireccion;
                }
            });

            soundPellet.onended = () => {
                if (estadoJuego === 'JUGANDO') {
                    if (pacman && pacman.velocidad > 0) {
                        try { soundEat.currentTime = 0; soundEat.play(); } catch(e) {}
                    } 
                }
            };
        }
        
        matriz_items_pacman[gridY][gridX] = CODIGOS_ITEM.VACIO;
        actualizarHUD();

        if (bolitasRestantes === 0) { 
            estadoJuego = 'NIVEL_COMPLETADO';
            try { soundGhost.pause(); } catch(e){}
            try { soundPellet.pause(); } catch(e){}
            try { soundEat.pause(); } catch(e){}
            mostrarMensaje("¡NIVEL COMPLETADO!");
            setTimeout(() => iniciarJuego(), 3000);
        }
        return true;
    }
    return false;
}

function actualizarPacman() {
    const { x, y } = obtenerPosicionCuadricula(pacman.pixelX, pacman.pixelY);
    const mediaCelda = TAMANO_CELDA / 2;
    verificarYComerItem(x, y);

    const estaAlineadoX = Math.abs(pacman.pixelX - (x * TAMANO_CELDA + mediaCelda)) < pacman.velocidad;
    const estaAlineadoY = Math.abs(pacman.pixelY - (y * TAMANO_CELDA + mediaCelda)) < pacman.velocidad;

    if (estaAlineadoX && estaAlineadoY) {
        pacman.alineado = true;
        pacman.pixelX = x * TAMANO_CELDA + mediaCelda;
        pacman.pixelY = y * TAMANO_CELDA + mediaCelda;

        if (pacman.direccion !== pacman.siguienteDireccion) {
            let siguienteX = x, siguienteY = y;
            switch (pacman.siguienteDireccion) {
                case 'ARRIBA': siguienteY--; break;
                case 'ABAJO': siguienteY++; break;
                case 'IZQUIERDA': siguienteX--; break;
                case 'DERECHA': siguienteX++; break;
            }
            if (puedeMoverseA(siguienteX, siguienteY)) { pacman.direccion = pacman.siguienteDireccion; }
        }
    } else { pacman.alineado = false; }

    let moverX = 0, moverY = 0;
    let siguienteGridX = x, siguienteGridY = y;

    switch (pacman.direccion) {
        case 'ARRIBA': moverY = -pacman.velocidad; siguienteGridY--; break;
        case 'ABAJO': moverY = pacman.velocidad; siguienteGridY++; break;
        case 'IZQUIERDA': moverX = -pacman.velocidad; siguienteGridX--; break;
        case 'DERECHA': moverX = pacman.velocidad; siguienteGridX++; break;
    }

    if (pacman.alineado && !puedeMoverseA(siguienteGridX, siguienteGridY)) { moverX = 0; moverY = 0; }

    pacman.pixelX += moverX;
    pacman.pixelY += moverY;

    // Túnel (wrapping robusto)
    if (y === 14) {
        const maxPixel = ANCHO_MAPA * TAMANO_CELDA - mediaCelda;
        if (pacman.pixelX <= -mediaCelda) pacman.pixelX = maxPixel;
        else if (pacman.pixelX >= ANCHO_MAPA * TAMANO_CELDA + mediaCelda) pacman.pixelX = mediaCelda;
    }

    pacman.gridX = obtenerPosicionCuadricula(pacman.pixelX, pacman.pixelY).x;
    pacman.gridY = obtenerPosicionCuadricula(pacman.pixelX, pacman.pixelY).y;

    if (pacman.velocidad > 0 && estadoJuego === 'JUGANDO' && pacman.direccion) {
        pacman.contadorAnimacion++;
        if (pacman.contadorAnimacion >= 2) { 
            pacman.ratioBocaAbierta += pacman.velocidadBoca;
            if (pacman.ratioBocaAbierta > 1 || pacman.ratioBocaAbierta < 0.1) { pacman.velocidadBoca *= -1; }
            pacman.contadorAnimacion = 0;
        }
    } else { 
        pacman.ratioBocaAbierta = Math.max(0, pacman.ratioBocaAbierta - 0.05); 
    }
}

function actualizar() {
    if (estadoJuego !== 'JUGANDO') return; 
    if (frightenedTimer > 0) {
        frightenedTimer--;
        if (frightenedTimer === 0) {
            try { soundPellet.pause(); } catch(e){}
            if (estadoJuego === 'JUGANDO') {
                try { soundGhost.play(); } catch(e){}
            }
            puntuacionFantasmaComido = 0;
            fantasmas.forEach(f => {
                if(f.modo === 'ASUSTADO') f.modo = 'PERSEGUIR';
            });
        }
    }
    actualizarPacman();
    fantasmas.forEach(f => f.actualizar()); 
    verificarColisiones();
}

// --- FUNCIONES DE DIBUJO ---
function dibujarMapa() {
    ctx.strokeStyle = COLOR_MURO; ctx.lineWidth = GROSOR_LINEA_MURO; ctx.lineCap = 'butt'; 

    for (let y = 0; y < ALTO_MAPA; y++) {
        for (let x = 0; x < ANCHO_MAPA; x++) {
            const pixelX = x * TAMANO_CELDA; const pixelY = y * TAMANO_CELDA;
            const centro = TAMANO_CELDA / 2; const codigoEstructura = matriz_estructura_pacman[y][x];

            ctx.fillStyle = '#000'; ctx.fillRect(pixelX, pixelY, TAMANO_CELDA, TAMANO_CELDA);

            const codigoItem = (matriz_items_pacman && matriz_items_pacman[y]) ? matriz_items_pacman[y][x] : CODIGOS_ITEM.VACIO;
            if (codigoItem === CODIGOS_ITEM.BOLITA) {
                ctx.fillStyle = 'white'; ctx.beginPath(); ctx.arc(pixelX + centro, pixelY + centro, 2, 0, Math.PI * 2); ctx.fill();
            } else if (codigoItem === CODIGOS_ITEM.BOLITA_PODER) {
                if (Math.floor(Date.now() / 200) % 2 === 0) {
                    ctx.fillStyle = 'white'; ctx.beginPath(); ctx.arc(pixelX + centro, pixelY + centro, 6, 0, Math.PI * 2); ctx.fill();
                }
            }

            if (codigoEstructura === CODIGOS_ESTRUCTURA.MURO) {
                const arriba = esMuro(x, y - 1), abajo = esMuro(x, y + 1), izquierda = esMuro(x - 1, y), derecha = esMuro(x + 1, y);
                
                ctx.strokeStyle = COLOR_MURO; ctx.beginPath();
                if (!arriba) { ctx.moveTo(pixelX, pixelY + GROSOR_LINEA_MURO/2); ctx.lineTo(pixelX + TAMANO_CELDA, pixelY + GROSOR_LINEA_MURO/2); }
                if (!abajo) { ctx.moveTo(pixelX, pixelY + TAMANO_CELDA - GROSOR_LINEA_MURO/2); ctx.lineTo(pixelX + TAMANO_CELDA, pixelY + TAMANO_CELDA - GROSOR_LINEA_MURO/2); }
                if (!izquierda) { ctx.moveTo(pixelX + GROSOR_LINEA_MURO/2, pixelY); ctx.lineTo(pixelX + GROSOR_LINEA_MURO/2, pixelY + TAMANO_CELDA); }
                if (!derecha) { ctx.moveTo(pixelX + TAMANO_CELDA - GROSOR_LINEA_MURO/2, pixelY); ctx.lineTo(pixelX + TAMANO_CELDA - GROSOR_LINEA_MURO/2, pixelY + TAMANO_CELDA); }
                ctx.stroke();

                ctx.fillStyle = COLOR_MURO;
                if (arriba && izquierda) { ctx.beginPath(); ctx.arc(pixelX + GROSOR_LINEA_MURO/2, pixelY + GROSOR_LINEA_MURO/2, RADIO_ESQUINA_MURO, Math.PI, 1.5 * Math.PI); ctx.fill(); }
                if (arriba && derecha) { ctx.beginPath(); ctx.arc(pixelX + TAMANO_CELDA - GROSOR_LINEA_MURO/2, pixelY + GROSOR_LINEA_MURO/2, RADIO_ESQUINA_MURO, 1.5 * Math.PI, 2 * Math.PI); ctx.fill(); }
                if (abajo && izquierda) { ctx.beginPath(); ctx.arc(pixelX + GROSOR_LINEA_MURO/2, pixelY + TAMANO_CELDA - GROSOR_LINEA_MURO/2, RADIO_ESQUINA_MURO, 0.5 * Math.PI, Math.PI); ctx.fill(); }
                if (abajo && derecha) { ctx.beginPath(); ctx.arc(pixelX + TAMANO_CELDA - GROSOR_LINEA_MURO/2, pixelY + TAMANO_CELDA - GROSOR_LINEA_MURO/2, RADIO_ESQUINA_MURO, 0, 0.5 * Math.PI); ctx.fill(); }

            } else if (codigoEstructura === CODIGOS_ESTRUCTURA.PUERTA_FANTASMA) {
                ctx.fillStyle = '#FFB8FF';
                ctx.fillRect(pixelX, pixelY + centro - GROSOR_LINEA_MURO / 2, TAMANO_CELDA, GROSOR_LINEA_MURO);
            }
        }
    }
}

function dibujarPacman() {
    if (estadoJuego === 'ANIMACION_MUERTE' && Math.floor(Date.now() / 100) % 2 === 0) {
        return;
    }
    
    const radio = TAMANO_CELDA / 2 - 1;
    ctx.fillStyle = 'yellow'; ctx.beginPath(); ctx.arc(pacman.pixelX, pacman.pixelY, radio, 0, Math.PI * 2); ctx.fill();
    
    if (pacman.ratioBocaAbierta > 0.05) {
        let rotacion = 0;
        switch (pacman.direccion) {
            case 'ARRIBA': rotacion = 1.5 * Math.PI; break;
            case 'ABAJO': rotacion = 0.5 * Math.PI; break;
            case 'IZQUIERDA': rotacion = Math.PI; break;
            case 'DERECHA': rotacion = 0; break;
        }
        const anguloBocaMax = 0.2 * Math.PI;
        const anguloBoca = anguloBocaMax * pacman.ratioBocaAbierta;
        const anguloInicio = rotacion + anguloBoca;
        const anguloFin = rotacion - anguloBoca;
        
        ctx.fillStyle = '#000'; ctx.beginPath(); ctx.moveTo(pacman.pixelX, pacman.pixelY); 
        ctx.arc(pacman.pixelX, pacman.pixelY, radio, anguloInicio, anguloFin, true);
        ctx.lineTo(pacman.pixelX, pacman.pixelY); ctx.fill();
    }
}

function dibujar() {
    ctx.clearRect(0, 0, lienzo.width, lienzo.height);
    if (estadoJuego === 'MENU_INICIO') {
        ctx.fillStyle = '#000';
        ctx.fillRect(0, 0, lienzo.width, lienzo.height);
        mostrarMensaje("PRESIONA CUALQUIER TECLA PARA INICIAR");
        return;
    }
    dibujarMapa();
    
    if (estadoJuego !== 'ANIMACION_MUERTE') {
        dibujarPacman();
    }
    
    fantasmas.forEach(f => f.dibujar());
}

function actualizarHUD() {
    scoreElement.innerText = puntuacion;
    livesElement.innerText = vidas;
}

function mostrarMensaje(texto, duracion = 0) {
    messagesElement.innerText = texto;
    messagesElement.style.display = 'block';

    if (duracion > 0) {
        setTimeout(() => {
            messagesElement.style.display = 'none';
        }, duracion);
    }
}

// --- BUCLE PRINCIPAL ---
function bucleJuego() {
    actualizar();
    dibujar();
    requestAnimationFrame(bucleJuego);
}

// --- MANEJO DE TECLADO ---
document.addEventListener('keydown', (e) => {
    if (estadoJuego === 'MENU_INICIO') {
        estadoJuego = 'IGNORE';
        iniciarJuego();
        return; 
    }

    if (estadoJuego === 'JUGANDO') {
        switch (e.key) {
            case 'ArrowUp': pacman.siguienteDireccion = 'ARRIBA'; break;
            case 'ArrowDown': pacman.siguienteDireccion = 'ABAJO'; break;
            case 'ArrowLeft': pacman.siguienteDireccion = 'IZQUIERDA'; break;
            case 'ArrowRight': pacman.siguienteDireccion = 'DERECHA'; break;
        }
    }

    if (e.key === 'r' || e.key === 'R') {
        iniciarJuego();
    }
});

// Iniciar el bucle
bucleJuego();