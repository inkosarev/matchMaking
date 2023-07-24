const { LOBBYS_SETTINGS } = require('../constants.js')

class Lobby {
    id
    host = null
    players = []

    constructor() {
        this.id = Date.now()
    }

    hasPlayer(player) {
        const result = !!this.players
            .filter(p => JSON.stringify(p) === JSON.stringify(player))
            .length
        
        return result
    }

    addPlayer(player) {
        if (this.hasPlayer(player)) return
        if (this.isEmpty()) this.setHost(player)
        this.players.push(player)
    }

    kickPlayer(player) {
        const index = this.players.indexOf(player);
        this.players.splice(index, 1)

        if (this.players.length) {
            this.setHost(this.players[0])
        } else {
            this.setHost(null)
        }
        
        return this.players.length
    }

    setHost(player) {
        this.host = player
    }

    lock() {
        this.isLocked = true
    }

    playersCount() {
        return this.players.length
    }

    maxPlayers() {
        return modePlayersCount[this.mode]
    }

    isLocked() {
        return false
    }

    isFull() {
        this.maxPlayers == this.playersCount
    }

    isEmpty() {
        return !this.players.length
    }
}

module.exports = {
    Lobby
}