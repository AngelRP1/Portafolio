document.addEventListener("DOMContentLoaded", () => {
    const canvas = document.getElementById('gameCanvas');
    const ctx = canvas.getContext('2d');
    canvas.height = window.innerHeight ;

    const splashScreen = document.getElementById('splashScreen');
    const seleccionPSJ = document.getElementById('playerSelect');
    const gameContainer = document.getElementById('gameContainer');

    splashScreen.addEventListener('animationend', () => {
        splashScreen.classList.add('oculto');
        seleccionPSJ.classList.remove('oculto');
    });

    const p1Button = document.getElementById('p1Button');
    const p2Button = document.getElementById('p2Button');

    const startButton = document.getElementById('startButton');
    const resetButton = document.getElementById('resetButton');

    const caminos = 4;
    const tamañoLinea = canvas.width / caminos; 
    const carWidth = tamañoLinea * 0.7;
    const carHeight = carWidth * 2;

    const soundCrash = new Audio('sound/car-crash.mp3');
    const soundScore = new Audio('sound/ding.mp3');

    const imgPlayer1 = new Image();
    imgPlayer1.src = 'img/player1.png';

    const imgPlayer2 = new Image();
    imgPlayer2.src = 'img/player2.png';

    const imgEnemigo1 = new Image();
    imgEnemigo1.src = 'img/enemy1.png';

    const imgEnemigo2 = new Image();
    imgEnemigo2.src = 'img/enemy2.png';

    const imgEnemigo3 = new Image();
    imgEnemigo3.src = 'img/enemy3.png';

    const imgRoca = new Image();
    imgRoca.src = 'img/roca1.png';

    const imgRoca2 = new Image();
    imgRoca2.src = 'img/roca2.png';

    const imgRoca3 = new Image();
    imgRoca3.src = 'img/roca3.png';

    const imgRoca4 = new Image();
    imgRoca4.src = 'img/roca4.png';

    const enemyImages = [imgEnemigo1, imgEnemigo2, imgEnemigo3];
    const sceneryImages = [imgRoca, imgRoca2, imgRoca3, imgRoca4];

    let juegoIniciado = false;
    let gameOver = false;
    let animacionID;
    let score = 0;
    let cont = 0;

    let tiempo = 0;
    let tiempoAparecido = 120; 
    let velocidadJuego = 3; 
    let enemigos = [];
    let scenery = [];

    let roadOffset = 0;

    const player1 = {
        name: "Jugador 1", 
        lane: 1, 
        x: 0,
        y: canvas.height - carHeight + 80,
        width: carWidth,
        height: carHeight,
        img: imgPlayer1
    };

    const player2 = {
        name: "Jugador 2", 
        lane: 2, 
        x: 0,
        y: canvas.height - carHeight + 80,
        width: carWidth,
        height: carHeight,
        img: imgPlayer2
    };

    function actPosicion() {
        player1.x = (player1.lane * tamañoLinea) + (tamañoLinea / 2);
        if (cont === 2) {
            player2.x = (player2.lane * tamañoLinea) + (tamañoLinea / 2);
        }
    }

    /*dibuja la carretera */

    function dibujaCarretera() {
        ctx.fillStyle = '#4a4a4a';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 4;
        ctx.setLineDash([10, 15]); 

        ctx.lineDashOffset = -roadOffset;

        for (let i = 1; i < caminos; i++) {
            const x = i * tamañoLinea;
            ctx.beginPath();
            ctx.moveTo(x, 0);
            ctx.lineTo(x, canvas.height);
            ctx.stroke();
        }
        ctx.setLineDash([]);
        ctx.lineDashOffset = 0;
    }

    /* diseño carrito*/

    function cuerpo(entidad) {
        const drawX = entidad.x - entidad.width / 2;
        const drawY = entidad.y - entidad.height / 2;
        ctx.drawImage(entidad.img, drawX, drawY, entidad.width, entidad.height);
    }

    /*Escenario (piedras y asi)*/

    const sceneryWidth = 80;
    const sceneryHeight = 80;

    function spawnScenery() {
        const canvasRect = canvas.getBoundingClientRect();
        const side = Math.random() < 0.5 ? 0 : 1;

        let sceneryX;
        if (side === 0) {
            sceneryX = Math.random() * (canvasRect.left - sceneryWidth - 10) + 10;
        } else {
            sceneryX = (Math.random() * (window.innerWidth - canvasRect.right - sceneryWidth - 10)) + canvasRect.right + 10;
        }

        if ((side === 0 && sceneryX > canvasRect.left) || (side === 1 && sceneryX < canvasRect.right)) {
            return;
        }

        const randomIndex = Math.floor(Math.random() * sceneryImages.length);
        const randomSceneryImg = sceneryImages[randomIndex];

        const rockElement = new Image();
        rockElement.src = randomSceneryImg.src;
        rockElement.classList.add('dom-rock');
        rockElement.style.position = 'absolute';
        rockElement.style.width = sceneryWidth + 'px';
        rockElement.style.height = sceneryHeight + 'px';
        rockElement.style.left = sceneryX + 'px';
        rockElement.style.top = -sceneryHeight + 'px';
        rockElement.style.zIndex = 0;

        document.body.appendChild(rockElement);

        const baseSpeed = 3;
        const currentSpeed = velocidadJuego * 0.8;
        const durationInSeconds = 5 * (baseSpeed / currentSpeed);

        rockElement.style.transition = `transform ${durationInSeconds}s linear`;

        rockElement.getBoundingClientRect(); 

        rockElement.style.transform = `translateY(${window.innerHeight + sceneryHeight + 20}px)`;

        rockElement.addEventListener('transitionend', () => {rockElement.remove();
});
    }

    function puntaje() {
        ctx.fillStyle = 'white';
        ctx.font = '24px Lucida Sans Unicode';
        ctx.textAlign = 'left'; 
        ctx.textBaseline = 'top'; 
        ctx.fillText('puntaje: ' + score, 10, 10);
    }

    function randomSpawn() {
        const freeLane = Math.floor(Math.random() * caminos);

        for (let i = 0; i < caminos; i++) {
            if (i === freeLane) continue;

            if (Math.random() < 0.7) { 
                const randomIndex = Math.floor(Math.random() * enemyImages.length);
                const randomEnemyImg = enemyImages[randomIndex];
                const enemy = {
                    lane: i,
                    x: (i * tamañoLinea) + (tamañoLinea / 2),
                    y: -carHeight - (Math.random() * 200),
                    width: carWidth,
                    height: carHeight,
                    speed: velocidadJuego + Math.random() * 2,
                    img: randomEnemyImg
                };
                enemigos.push(enemy);
            }
        }
        if (velocidadJuego < 10) velocidadJuego += 0.1;
        if (tiempoAparecido > 40) tiempoAparecido -= 1;
    }

    function choques(player, enemy) {
        const playerLeft = player.x - player.width / 2;
        const playerRight = player.x + player.width / 2;
        const playerTop = player.y - player.height / 2;
        const playerBottom = player.y + player.height / 2;

        const enemyLeft = enemy.x - enemy.width / 2;
        const enemyRight = enemy.x + enemy.width / 2;
        const enemyTop = enemy.y - enemy.height / 2;
        const enemyBottom = enemy.y + enemy.height / 2;
        return (
            playerLeft < enemyRight &&
            playerRight > enemyLeft &&
            playerTop < enemyBottom &&
            playerBottom > enemyTop
        );
    }

    /* Ciclo de juego*/

    function ciclo() {
        if (!juegoIniciado) return;

        roadOffset += velocidadJuego;
        roadOffset %= 25;

        dibujaCarretera();
        tiempo++;
        if (tiempo > tiempoAparecido) {
            randomSpawn();
            if (Math.random() < 0.5) {
                spawnScenery();
            }
            tiempo = 0;
        }

        for (let i = scenery.length - 1; i >= 0; i--) {
            const item = scenery[i];
            item.y += item.speed;
            if (item.y > canvas.height + (item.height / 2)) {
                scenery.splice(i, 1);
            } else {
                cuerpo(item);
            }
        }

        for (let i = enemigos.length - 1; i >= 0; i--) {
            const enemy = enemigos[i];
            enemy.y += enemy.speed;

            if (enemy.y > canvas.height + (enemy.height / 2)) {
                enemigos.splice(i, 1); 
                if (cont === 1) {
                score += 10;
                soundScore.play();
                }
            } else {
                cuerpo(enemy);
            }

            let p1Hit = choques(player1, enemy);

            if (cont === 1) {
                if (p1Hit) {
                    finJuego(null); 
                    return;
                }
            } else {
                let p2Hit = choques(player2, enemy);
                if (p1Hit) {
                    finJuego(player2); 
                    return;
                } else if (p2Hit) {
                    finJuego(player1);
                    return;
                }
            }
        }

        cuerpo(player1);
        if (cont === 2) {
            cuerpo(player2);
        }

        if (cont === 1) {
            puntaje();
        }
        animacionID = requestAnimationFrame(ciclo);
    }

    function inicioJuego() {
        const oldRocks = document.querySelectorAll('.dom-rock');
        oldRocks.forEach(rock => rock.remove());
        if (juegoIniciado) return;
        juegoIniciado = true;
        gameOver = false;
        score = 0;
        enemigos = [];
        velocidadJuego = 3;
        tiempo = 0;
        tiempoAparecido = 120;

        player1.lane = 1;
        if (cont === 2) {
            player2.lane = 2;
        }
        actPosicion();

        startButton.disabled = true;
        ciclo();
    }

    function finJuego(winner) {
        soundCrash.play();
        juegoIniciado = false;
        gameOver = true;
        cancelAnimationFrame(animacionID);
        startButton.disabled = true; 

        const allRocks = document.querySelectorAll('.dom-rock');

        allRocks.forEach(rock => {
            const computedStyle = window.getComputedStyle(rock);
            const currentTransform = computedStyle.transform;
            
            rock.style.transition = 'none';

            rock.style.transform = currentTransform;
        });

        ctx.fillStyle = 'rgba(176, 18, 18, 0.7)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = 'white';
        ctx.textAlign = 'center';

        if (winner) {
            ctx.font = '40px Lucida Sans Unicode'; 
            ctx.fillText(`¡Felicidades a`, canvas.width / 2, canvas.height / 2 - 40); 

            ctx.font = '45px Lucida Sans Unicode'; 
            const winnerNameParts = winner.name.split(' ');
            const line1 = winnerNameParts[0] + ' ' + winnerNameParts[1]; 
            const line2 = winnerNameParts[2]; 

            ctx.fillText(line1.toUpperCase(), canvas.width / 2, canvas.height / 2 + 10); 
            ctx.fillText(line2.toUpperCase(), canvas.width / 2, canvas.height / 2 + 60); 
        } else {
            ctx.font = '50px Lucida Sans Unicode'; 
            ctx.fillText('¡Pipipi perdiste!', canvas.width / 2, canvas.height / 2 - 30); 
            ctx.font = '30px Lucida Sans Unicode'; 
            ctx.fillText('puntaje final: ' + score, canvas.width / 2, canvas.height / 2 + 20); 
        }
    }

    function eligePSJ(count) {
        cont = count;
        seleccionPSJ.classList.add('oculto');
        gameContainer.classList.remove('oculto');
        document.body.classList.add('fondo-juego-activo');

        if (cont === 2) {
            score = 0; 
        }

        pantallaInicial();
    }

    p1Button.addEventListener('click', () => eligePSJ(1));
    p2Button.addEventListener('click', () => eligePSJ(2));

    document.addEventListener('keyup', (e) => {
        if (!juegoIniciado || gameOver) return;

        if (e.key === 'ArrowLeft') {
            player1.lane = Math.max(0, player1.lane - 1); 
        } else if (e.key === 'ArrowRight') {
            player1.lane = Math.min(caminos - 1, player1.lane + 1);
        }

        if (cont === 2) {
            if (e.key === 'a' || e.key === 'A') {
                player2.lane = Math.max(0, player2.lane - 1); 
            } else if (e.key === 'd' || e.key === 'D') {
                player2.lane = Math.min(caminos - 1, player2.lane + 1);
            }
        }

        actPosicion(); 
    });

    startButton.addEventListener('click', inicioJuego);
    resetButton.addEventListener('click', () => {
        location.reload(); 
    });

    function pantallaInicial() {
        dibujaCarretera();
        actPosicion();
        cuerpo(player1);
        if (cont === 2) {
            cuerpo(player2);
        }

        ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = 'white';
        ctx.font = '24px Lucida Sans Unicode';
        ctx.textAlign = 'center';
        ctx.fillText('Pulsa "Iniciar Juego" para empezar', canvas.width / 2, canvas.height / 2);
    }
});