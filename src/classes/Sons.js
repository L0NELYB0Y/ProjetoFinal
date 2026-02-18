class Sons {
    constructor() {
    this.shootSons = [
        new Audio("src/assets/audios/shoot.mp3"),
        new Audio("src/assets/audios/shoot.mp3"),
        new Audio("src/assets/audios/shoot.mp3"),
        new Audio("src/assets/audios/shoot.mp3"),
        new Audio("src/assets/audios/shoot.mp3"),
    ]

    this.hitSons = [
        new Audio("src/assets/audios/hit.mp3"),
        new Audio("src/assets/audios/hit.mp3"),
        new Audio("src/assets/audios/hit.mp3"),
        new Audio("src/assets/audios/hit.mp3"),
        new Audio("src/assets/audios/hit.mp3"),
    ]

    this.explosionSom = new Audio("src/assets/audios/explosion.mp3")
    this.nextLevelSom = new Audio("src/assets/audios/next_level.mp3")

    this.currentShootSom = 0
    this.currenthitSom = 0

    this.adjustVolumes();
    }

    playShootSom() {
        this.shootSons[this.currentShootSom].currentTime = 0
        this.shootSons[this.currentShootSom].play()
        this.currentShootSom = (this.currentShootSom +1) % this.shootSons.length
    }

    playHitSom() {
        this.hitSons[this.currenthitSom].currentTime = 0
        this.hitSons[this.currenthitSom].play()
        this.currenthitSom = (this.currenthitSom +1) % this.hitSons.length
    }

    playExplosionSom() {
        this.explosionSom.play()
    }

    playNextLevelSom() {
        this.nextLevelSom.play()
    }

    adjustVolumes(){
        this.hitSons.forEach(som => (som.volume = 0.2))
        this.shootSons.forEach(som => (som.volume = 0.5))
        this.explosionSom.volume = 0.2
        this.explosionSom.volume = 0.4
    }
}

export default Sons