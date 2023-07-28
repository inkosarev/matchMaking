const { MODE_PLAYERS_CNT } = require('../constants.js')

class Lobby {
    id
    host = null
    players = []

    constructor() {
        this.id = Date.now().toString()
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

    playersCount() {
        return this.players.length
    }

    maxPlayers() {
        return MODE_PLAYERS_CNT[this.mode]
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