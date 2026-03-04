import Alien from "./alien.js";
class Grid {
    constructor(rows, cols) {
        this.rows = rows;
        this.cols = cols;
        this.direction = "right";
        this.moveDown = false;
        this.boost = 0.1;
        this.aliensVelocity = 1;
        this.aliens = this.init();
    }

    init() {
        const array = []


        for (let row = 0; row < this.rows; row += 1) {
            for (let col = 0; col < this.cols; col += 1) {
                const alien = new Alien(
                    {
                        x: col * 50 + 20,
                        y: row * 37 + 120,
                    },
                    this.aliensVelocity
                
                    
                );

                array.push(alien);
            }
            
        }

        return array;
    }
        draw(ctx) {
        this.aliens.forEach((alien) => alien.draw(ctx));
    }

    update(jogadorStatus) {
        if (this.reachedRightBoundary()) {
            this.direction = "left";
            this.moveDown = true;
        } else if (this.reachedLeftBoundary()) {
            this.direction = "right";
            this.moveDown = true;
        }

        if (!jogadorStatus) this.moveDown = false;

        this.aliens.forEach((alien) => {
            if (this.moveDown) {
                alien.moveDown();
                alien.incrementVelocity(this.boost);
                this.aliensVelocity = alien.velocity;
            }

            if (this.direction === "right") alien.moveRight();
            if (this.direction === "left") alien.moveLeft();
        });

        this.moveDown = false;
    }

    reachedRightBoundary() {
        return this.aliens.some(
            (alien) => alien.position.x + alien.width >= innerWidth
        );
    }

    reachedLeftBoundary() {
        return this.aliens.some((alien) => alien.position.x <= 0);
    }

    getRandomAlien() {
        const index = Math.floor(Math.random() * this.aliens.length);
        return this.aliens[index];
    }

    restart() {
        this.aliens = this.init();
        this.direction = "right";
    }
        activateCheat() {
        this.cheatActivated = true;
        this.aliens = this.init();
    }

    deactivateCheat() {
        this.cheatActivated = false;
        this.aliens = this.init();
    }

    increaseSpeed() {
        this.aliensVelocity *= 5;

        this.aliens.forEach(alien => alien.velocity = this.aliensVelocity);
    }
}

export default Grid