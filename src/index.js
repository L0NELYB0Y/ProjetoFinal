import Jogador from "./classes/Jogador.js";
import Tiro from "./classes/Tiros.js";

const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");

canvas.width = innerWidth;
canvas.height = innerHeight;

ctx.imageSmoothingEnabled = false;

const jogador = new Jogador(canvas.width, canvas.height);
const jogadorTiros = [];
const keys = {
    left: false,
    right: false,
    shoot: {
        pressed: false,
        released: true
    }
}

const gameLoop = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);



    ctx.save();
    ctx.translate(jogador.position.x + jogador.width / 2, jogador.position.y + jogador.height / 2);

    if (keys.shoot.pressed && keys.shoot.released) {
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

    requestAnimationFrame(gameLoop);
}

addEventListener("keydown", (event) => {
    const key = event.key.toLowerCase();

    if (key === "a") keys.left = true;
    if (key === "d") keys.right = true;
    if (key === "enter") keys.shoot.pressed = true;
});

addEventListener("keyup", (event) => {
    const key = event.key.toLowerCase();

    if (key === "a") keys.left = false;
    if (key === "d") keys.right = false;
    if (key === "enter") {
        keys.shoot.pressed = false;
        keys.shoot.released = true;
    }
});

gameLoop();