class Room {
    id
    players = []
    _isLocked = false
    map
    filter

    constructor(payload) {
        this.id = Date.now()
        this.map = payload.map,
        this.filter = {
            gameMode: payload.gameMode,
            hasBots: payload.hasBots,
            version: payload.version,
        }
    }
    
    addPlayer(player) {
        this.players.push(player)
    }

    lock() {
        this.isLocked = true
    }

    unlock() {
        this.isLocked = false
    }

    playersCount() {
        return this.players.length
    }

    maxPlayers() {
        return MODE_PLAYERS_CNT[this.filter.gameModemode]
    }

    isLocked() {
        return this._isLocked
    }

    isFull() {
        this.maxPlayers === this.playersCount
    }

    isAvailable() {
        return !this.isFull() && !this.isLocked()
    }
}

module.exports = {
    Room
}