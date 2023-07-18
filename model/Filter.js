class Filter {
    version
    gameMode
    hasBots
    map
    constructor({ version, gameMode, hasBots, map }) {
        this.version = version
        this.gameMode = gameMode
        this.hasBots = hasBots
        this.map = map
    }
}

module.exports = {
    Filter
}