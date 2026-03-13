import Grid from "./classes/Grid.js"
import Jogador from "./classes/Jogador.js";
import Particle from "./classes/Particle.js";
import { GameState, NUMBER_ESTRELAS } from "./utils/constantes.js";
import Obstaculo from "./classes/Obstaculo.js";
import Sons from "./classes/Sons.js";
import Estrela from "./classes/Estrelas.js";

const som = new Sons();
const musica = new Audio("src/assets/audios/musica.mp3");
const gameovermusic = new Audio ("src/assets/audios/gameover.mp3");
musica.loop = true;
musica.volume = 0.4;
gameovermusic.volume = 0.4;


const startScreen = document.querySelector(".start-screen");
const gameOverScreen = document.querySelector(".game-over");
const scoreUi = document.querySelector(".score-ui");
const scoreElement = scoreUi.querySelector(".score > span");
const levelElement = scoreUi.querySelector(".level > span");
const highElement = scoreUi.querySelector(".high > span");
const timerElement = scoreUi.querySelector(".timer > span");
const livesElement = document.querySelector(".lives > span");
const buttonPlay = document.querySelector(".button-play");
const buttonRestart = document.querySelector(".button-restart");

gameOverScreen.remove()

const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");

canvas.width = innerWidth;
canvas.height = innerHeight;

ctx.imageSmoothingEnabled = false;

let currentState = GameState.START

const gameData = {
    score: 0,
    level: 1,
    high: 0,
    timer: 45,
    lives: 3,
}

let countdownInterval = null;

const showGameData = () => {
    scoreElement.textContent = gameData.score
    levelElement.textContent = gameData.level
    highElement.textContent = gameData.high
    timerElement.textContent = gameData.timer + "s"
    livesElement.textContent = gameData.lives
}

const jogador = new Jogador(canvas.width, canvas.height);
const grid = new Grid(3, 6);

const estrelas = [];
const jogadorTiros = [];
const aliensTiros = [];
const particles = [];
const obstaculos = [];

const initObstaculos = () => {

    obstaculos.length = 0;

    const quantidade = Math.floor(Math.random() * 3) + 2;
    
    const y = canvas.height - 250;
    const color = "crimson";

    for (let i = 0; i < quantidade; i++) {
        const x = Math.random() * (canvas.width - 120);

        const obstaculo = new Obstaculo(
            {x: x, y: y },
            100,
            20,
            color
        );

        obstaculos.push(obstaculo);
    }
};


initObstaculos();

const keys = {
    left: false,
    right: false,
    up: false,
    down: false,
    shoot: {
        pressed: false,
        released: true
    }
}

const incrementScore = (value) => {
    gameData.score += value

    if (gameData.score > gameData.high) {
        gameData.high = gameData.score
    }
}

const drawObstaculos = () => {
    obstaculos.forEach((obstaculo) => obstaculo.draw(ctx));
};

const generateEstrelas = () => {
    for (let i = 0; i < NUMBER_ESTRELAS; i += 1) {
        estrelas.push(new Estrela(canvas.width, canvas.height));
    }
};

const drawEstrelas = () => {
    estrelas.forEach((estrela) => {
        estrela.draw(ctx);
        estrela.update();
    });
};



const drawTiros = () => {
    const tiros = [...jogadorTiros, ...aliensTiros];


    tiros.forEach((tiro) => {
        tiro.draw(ctx);
        tiro.update();
    })
};

const drawParticles = () => {
    particles.forEach((particle) => {
        particle.draw(ctx);
        particle.update();
    });
};

const clearTiros = () => {
    jogadorTiros.forEach((tiro, index) => {
        if (tiro.position.y <= 0) {
            jogadorTiros.splice(index, 1)
        }
    });
}

const clearParticles = () => {
    particles.forEach((particle, i) => {
        if (particle.opacity <= 0) {
            particles.splice(i, 1);
        }
    });
}

const criarExplosao = (position, size, color) => {
    for (let i = 0; i < size; i += 1) {
        const particle = new Particle(
            {
                x: position.x,
                y: position.y,
            },
            {
               x: Math.random() - 0.5 * 1.5,
               y: Math.random() - 0.5 * 1.5, 
            },
            2,
            color
        );

        particles.push(particle);

    }
};

const checkShootAliens = () => {
    grid.aliens.forEach((alien, alienIndex) => {
        jogadorTiros.some((tiro, tiroIndex) =>{
            if (alien.hit(tiro)) {
                som.playHitSom();
                criarExplosao(
                    {
                        x: alien.position.x + alien.width / 2,
                        y: alien.position.y + alien.height / 2,
                    },
                    45,
                    "#5c9747"
                );

                incrementScore(10)

                grid.aliens.splice(alienIndex, 1);
                jogadorTiros.splice(tiroIndex, 1);
            }
        })

    })
}

const checkShootJogador = () => {
    aliensTiros.some((tiro, i) => {

        if (!jogador.invincible && jogador.hit(tiro)) {

            aliensTiros.splice(i, 1);

            som.playExplosionSom();

            gameData.lives--;
            if (gameData.lives < 0) gameData.lives = 0;
            showGameData();

            criarExplosao(
                { x: jogador.position.x + jogador.width/2, y: jogador.position.y + jogador.height/2 },
                10,
                "white"
            );
            criarExplosao(
                { x: jogador.position.x + jogador.width/2, y: jogador.position.y + jogador.height/2 },
                10,
                "white"
            );
            criarExplosao(
                { x: jogador.position.x + jogador.width/2, y: jogador.position.y + jogador.height/2 },
                10,
                "white"
            );

            jogador.invincible = true;
            jogador.invincibilityTimer = 120;
            jogador.blink = true;

            if (gameData.lives <= 0) {
                gameOver();
            }
        }
    });
};

const checkShootObstaculos = () => {
    obstaculos.forEach((obstaculo) => {
        jogadorTiros.some((tiro, i) => {
        if (obstaculo.hit(tiro)) {
            jogadorTiros.splice(i, 1);
        }
    })
    });

    obstaculos.forEach((obstaculo) => {
        aliensTiros.some((tiro, i) => {
        if (obstaculo.hit(tiro)) {
            aliensTiros.splice(i, 1);
        }
    })
    });
}

const checkJogadorObstaculos = (newX, newY) => {
    for (let obstaculo of obstaculos) {
        if (
            newX < obstaculo.position.x + obstaculo.width &&
            newX + jogador.width > obstaculo.position.x &&
            newY < obstaculo.position.y + obstaculo.height &&
            newY + jogador.height > obstaculo.position.y
        ) {
            return true; // existe colisão, bloqueia movimento
        }
    }
    return false; // não há colisão
};

const spawnGrid = () => {
    if (grid.aliens.length === 0) {
        som.playNextLevelSom();
        grid.rows = Math.round(Math.random() * 9 + 1)
        grid.cols = Math.round(Math.random() * 9 + 1)
        grid.restart();

        gameData.level += 1
        gameData.timer += 15

        if (gameData.level >= 9) {
            grid.aliensVelocity += 0.5;
        }

        grid.restart();

    }
};

const gameOver = () => {

    clearInterval(countdownInterval);
    stopMusica();
    playGameovermusic();

    criarExplosao({ x: jogador.position.x + jogador.width / 2, y: jogador.position.y + jogador.height / 2, }, 10, "white");
    criarExplosao({ x: jogador.position.x + jogador.width / 2, y: jogador.position.y + jogador.height / 2, }, 10, "white");
    criarExplosao({ x: jogador.position.x + jogador.width / 2, y: jogador.position.y + jogador.height / 2, }, 10, "white");

   currentState = GameState.GAMEOVER;
    jogador.alive = false;
    document.body.append(gameOverScreen)
};

const startTimer = () => {
    gameData.timer = 45;

    if (countdownInterval) {
        clearInterval(countdownInterval);
    }

    countdownInterval = setInterval(() => {
        if (currentState !== GameState.PLAYING) return;

        if (gameData.timer > 0) {
            gameData.timer--;
        }
        else {
            clearInterval(countdownInterval);
            gameOver();
        }
            
    }, 1000);
};

const playMusica = () => {
    musica.currentTime = 0;
    musica.play().catch(() => {});
};

const stopMusica = () => {
    musica.pause();
}

const playGameovermusic = () => {
    gameovermusic.currentTime = 0;
    gameovermusic.play().catch(() => {});
};

const stopGameovermusic = () => {
    gameovermusic.pause();
}

const cheatCode = "hard";
let enteredCode = "";
let cheatActivated = false;

const activateCheatCode = () => {
    if (!cheatActivated) {

        cheatActivated = true;

        grid.activateCheat();
        grid.increaseSpeed();

    };
}
    addEventListener("keydown", (event) => {
        enteredCode += event.key.toLowerCase();

        if (enteredCode === cheatCode) {
            activateCheatCode();
            enteredCode = "";
        }

        if (!cheatCode.startsWith(enteredCode)) {
            enteredCode = "";
        }
    });

const limiteObstaculos = canvas.height - 225;

    const gameLoop = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    drawEstrelas();

    if (currentState == GameState.PLAYING) {
    showGameData();
    spawnGrid();

    drawParticles();
    drawTiros();
    drawObstaculos();
    
    clearTiros();
    clearParticles();

    checkShootJogador();
    checkShootAliens();
    checkShootObstaculos();

    grid.draw(ctx);
    grid.update(jogador.alive);


    ctx.save(); 
    ctx.translate(jogador.position.x + jogador.width / 2, jogador.position.y + jogador.height / 2);

    if (keys.shoot.pressed && keys.shoot.released) {
        som.playShootSom()
        jogador.shoot(jogadorTiros);
        keys.shoot.released = false;
    }

    if (keys.left && jogador.position.x >= 0) {
        jogador.moveLeft();
        ctx.rotate(-0.15);
    }

    if (keys.right && jogador.position.x <= canvas.width - jogador.width) {
        jogador.moveRight();
        ctx.rotate(0.15);
    }

    if (keys.up && jogador.position.y > limiteObstaculos) {
        jogador.position.y -= 5;
    }

    if (keys.down && jogador.position.y <= canvas.height - jogador.height) {
    jogador.position.y += 5;
}

    checkJogadorObstaculos();

    ctx.translate(-jogador.position.x - jogador.width / 2, -jogador.position.y - jogador.height / 2);


    jogador.draw(ctx);
    ctx.restore();
    }

    if (currentState == GameState.GAMEOVER) {
        checkShootObstaculos();
        
        drawParticles();
        drawTiros();
        drawObstaculos();

        clearTiros();
        clearParticles();

        grid.draw(ctx);
        grid.update(jogador.alive);
    }
    

    requestAnimationFrame(gameLoop);
}

addEventListener("keydown", (event) => {
    const key = event.key.toLowerCase();

    if (key === "arrowleft") keys.left = true;
    if (key === "arrowright") keys.right = true;
    if (key === "arrowup") keys.up = true;
    if (key === "arrowdown") keys.down = true;
    if (key === "a") keys.shoot.pressed = true;
});

addEventListener("keyup", (event) => {
    const key = event.key.toLowerCase();

    if (key === "arrowleft") keys.left = false;
    if (key === "arrowright") keys.right = false;
    if (key === "arrowup") keys.up = false;
    if (key === "arrowdown") keys.down = false;
    if (key === "a") {
        keys.shoot.pressed = false;
        keys.shoot.released = true;
    }
});

buttonPlay.addEventListener("click", () => {
    startScreen.remove()
    scoreUi.style.display ="block"
    currentState = GameState.PLAYING

    playMusica();
    startTimer();
    stopGameovermusic();

    setInterval(() => {
    const alien = grid.getRandomAlien();

    if (alien) {
        alien.shoot(aliensTiros);
    }
}, 1000);
});

buttonRestart.addEventListener("click", () => {
  currentState = GameState.PLAYING
  jogador.alive = true
  
  grid.rows = 3
  grid.cols = 6
  grid.restart()

  grid.aliensVelocity = 1;

  aliensTiros.length = 0

  gameData.score = 0
  gameData.level = 1
  gameData.lives = 3

  jogador.invincible = false;
  jogador.invincibilityTimer = 0;
  jogador.blink = false;

  initObstaculos();
  gameOverScreen.remove()

  playMusica();
  stopGameovermusic();
  startTimer();
  cheatActivated = false;
  enteredCode = "";

  grid.deactivateCheat();

});

generateEstrelas();
gameLoop();