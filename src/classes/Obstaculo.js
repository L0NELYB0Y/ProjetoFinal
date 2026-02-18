class Obstaculo {
    constructor(position, width, height, color) {
        this.position = position;
        this.width = width;
        this.height = height;
        this.color = color;
    }

    draw(ctx) {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.position.x, this.position.y, this.width, this.height);
    }
    
    hit(tiro) {
        const tiroPositionY = tiro.velocity < 0 ? tiro.position.y : tiro.position.y + tiro.height
        return (
            tiro.position.x >= this.position.x &&
            tiro.position.x <= this.position.x + this.width &&
            tiroPositionY >= this.position.y &&
            tiroPositionY <= this.position.y + this.height
        );
    }
}

export default Obstaculo