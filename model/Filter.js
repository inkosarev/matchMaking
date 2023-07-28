class Filter {
    version
    gameMode
    hasBots

    constructor(gameMode, hasBots, version) {
        this.gameMode = gameMode
        this.hasBots = hasBots
        this.version = version
    }
}

module.exports = {
    Filter
}