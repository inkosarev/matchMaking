const { MODE_PLAYERS_CNT } = require('../constants')

class Room {
    id
    players = []
    _isLocked = false
    map
    filter

    constructor(payload) {
        this.id = Date.now().toString()
        this.map = payload.map,
        this.filter = {
            gameMode: payload.gameMode,
            hasBots: payload.hasBots,
            version: payload.version,
        }
    }

    hasPlayer(player) {
        return !!this.players.filter(p => p.id === player.id).length
    }

    addPlayer(player) {
        player.lastRoomId = this.id
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
        return MODE_PLAYERS_CNT[this.filter.gameMode]
    }

    isLocked() {
        return this._isLocked
    }

    isFull() {
        return this.maxPlayers() === this.playersCount()
    }

    isEmpty() {
        return !this.players.length
    }

    isAvailable() {
        return !this.isFull() && !this.isLocked()
    }

    kickPlayer(player) {
        const index = this.players.indexOf(player);
        this.players.splice(index, 1)
    }
}

module.exports = {
    Room
}