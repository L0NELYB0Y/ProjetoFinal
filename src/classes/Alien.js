import { ImagemAlien } from "../utils/constantes.js";
import Tiro from "./Tiros.js"

class Alien {
    constructor(position, velocity) {
        this.position = position
        this.scale = 0.8;
        this.width = 50 * this.scale;
        this.height = 37 * this.scale;
        this.velocity = velocity;

        this.image = this.getImage(ImagemAlien);
        

    }

    moveRight() {
        this.position.x += this.velocity;
    }

    moveLeft() {
        this.position.x -= this.velocity;
    }

    moveDown() {
        this.position.y += this.height;
    }

    incrementVelocity(boost) {
        this.velocity += boost;
    }

    getImage(path) {
        const image = new Image()
        image.src = path;
        return image;
    }

    draw(ctx) {
        ctx.drawImage(this.image, this.position.x, this.position.y, this.width, this.height);
    }

    shoot(tiros) {
        const t = new Tiro({
            x: this.position.x + this.width / 2 - 2,
            y: this.position.y + this.height,
        },
        10
    );

    tiros.push(t)
    }
        hit(tiro) {
        return (
            tiro.position.x >= this.position.x &&
            tiro.position.x <= this.position.x + this.width &&
            tiro.position.y >= this.position.y &&
            tiro.position.y <= this.position.y + this.height
        );
    }
}

export default Alien;