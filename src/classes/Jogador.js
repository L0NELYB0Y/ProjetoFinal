import { FramesIniciais, ImagemFogo, ImagemNave, SpriteFogo } from "../utils/constantes.js";
import Tiro from "./Tiros.js";

class Jogador {
    constructor(canvasWidth, canvasHeight) {
        this.width = 48 * 2;
        this.height = 48 * 2;
        this.velocity = 6;

        this.position = {
            x: canvasWidth / 2 - this.width / 2,
            y: canvasHeight - this.height - 30,
        };

        this.image = this.getImage(ImagemNave);
        this.engineImage = this.getImage(ImagemFogo);
        this.engineSprites = this.getImage(SpriteFogo);

        this.sx = 0;
        this.framesCounter = FramesIniciais;


    }

    getImage(path) {
        const image = new Image()
        image.src = path;
        return image;
    }

    moveLeft() {
        this.position.x -= this.velocity;
    }

    moveRight() {
        this.position.x += this.velocity;
    }


    draw(ctx) {
        ctx.drawImage(this.engineSprites, this.sx, 0, 48, 48, this.position.x, this.position.y + 10, this.width, this.height);
        ctx.drawImage(this.image, this.position.x, this.position.y, this.width, this.height);
        ctx.drawImage(this.engineImage, this.position.x, this.position.y + 8, this.width, this.height);

        this.update();
    }

    update() {
        if (this.framesCounter === 0) {
            this.sx = this.sx === 96 ? 0 : this.sx + 48;
            this.framesCounter = FramesIniciais;
        }

        this.framesCounter --;

    }

    shoot() {
        const t = new Tiro();
    }
}

export default Jogador;