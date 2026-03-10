class Obstaculo {
    constructor(position, width, height, color) {
        this.position = position;
        this.width = width;
        this.height = height;
        this.color = color;

        this.blockSize = 10; 
        this.blocks = [];

        const rows = Math.floor(height / this.blockSize);
        const cols = Math.floor(width / this.blockSize);

        for (let y = 0; y < rows; y++) {
            for (let x = 0; x < cols; x++) {
                this.blocks.push({
                    x: position.x + x * this.blockSize,
                    y: position.y + y * this.blockSize,
                    width: this.blockSize,
                    height: this.blockSize
                });
            }
        }
    }

    draw(ctx) {
        ctx.fillStyle = this.color;
        this.blocks.forEach(block => {
            ctx.fillRect(block.x, block.y, block.width, block.height);
        });
    }

    hit(tiro) {
        for (let i = 0; i < this.blocks.length; i++) {
            const block = this.blocks[i];

            const tiroPositionY = tiro.velocity < 0 ? tiro.position.y : tiro.position.y + tiro.height;

            if (
                tiro.position.x >= block.x &&
                tiro.position.x <= block.x + block.width &&
                tiroPositionY >= block.y &&
                tiroPositionY <= block.y + block.height
            ) {
                this.blocks.splice(i, 1);
            }
        }
        return false;
    }
}

export default Obstaculo