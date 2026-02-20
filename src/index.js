import Grid from "./classes/Grid.js"
import Jogador from "./classes/Jogador.js";
import Particle from "./classes/Particle.js";
import { GameState } from "./utils/constantes.js";
import Obstaculo from "./classes/obstaculo.js";
import Sons from "./classes/Sons.js";

const som = new Sons();

const startScreen = document.querySelector(".start-screen");
const gameOverScreen = document.querySelector(".game-over");
const scoreUi = document.querySelector(".score-ui");
const scoreElement = scoreUi.querySelector(".score > span");
const levelElement = scoreUi.querySelector(".level > span");
const highElement = scoreUi.querySelector(".high > span");
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
}

const showGameData = () => {
    scoreElement.textContent = gameData.score
    levelElement.textContent = gameData.level
    highElement.textContent = gameData.high
}

const jogador = new Jogador(canvas.width, canvas.height);
const grid = new Grid(3, 6); 

const jogadorTiros = [];
const aliensTiros = [];
const particles = [];
const obstaculos = [];

const initObstaculos = () => {
    const x = canvas.width / 2 - 50;
    const y = canvas.height - 250;
    const offset = canvas.width * 0.15;
    const color = "crimson";

    const obstaculo1 = new Obstaculo({ x: x - offset, y }, 100, 20, color);
    const obstaculo2 = new Obstaculo({ x: x + offset, y }, 100, 20, color);

    obstaculos.push(obstaculo1);
    obstaculos.push(obstaculo2);
};

initObstaculos();

const keys = {
    left: false,
    right: false,
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
                    10,
                    "#8ea961f8"
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
        if (jogador.hit(tiro)) {
            som.playExplosionSom();
            aliensTiros.splice(i, 1);
            gameOver();
        }
    })
}

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

const spawnGrid = () => {
    if (grid.aliens.length === 0) {
        som.playNextLevelSom();
        grid.rows = Math.round(Math.random() * 9 + 1)
        grid.cols = Math.round(Math.random() * 9 + 1)
        grid.restart();

        gameData.level += 1
    }
};



const gameOver = () => {
    criarExplosao({ x: jogador.position.x + jogador.width / 2, y: jogador.position.y + jogador.height / 2, }, 10, "white");
    criarExplosao({ x: jogador.position.x + jogador.width / 2, y: jogador.position.y + jogador.height / 2, }, 10, "white");
    criarExplosao({ x: jogador.position.x + jogador.width / 2, y: jogador.position.y + jogador.height / 2, }, 10, "white");

   currentState = GameState.GAMEOVER;
    jogador.alive = false;
    document.body.append(gameOverScreen)
};

const gameLoop = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

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
    if (key === "a") keys.shoot.pressed = true;
});

addEventListener("keyup", (event) => {
    const key = event.key.toLowerCase();

    if (key === "arrowleft") keys.left = false;
    if (key === "arrowright") keys.right = false;
    if (key === "a") {
        keys.shoot.pressed = false;
        keys.shoot.released = true;
    }
});

buttonPlay.addEventListener("click", () => {
    startScreen.remove()
    scoreUi.style.display ="block"
    currentState = GameState.PLAYING

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
  
  grid.aliens.length = 0
  grid.aliensVelocity = 1

  aliensTiros.length = 0

  gameData.score = 0
  gameData.level = 0

  gameOverScreen.remove()
});

gameLoop();