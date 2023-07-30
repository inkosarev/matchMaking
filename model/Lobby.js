const { MODE_PLAYERS_CNT, LOBBY_SETTINGS } = require('../constants.js')

class Lobby {
    id
    host = null
    players = []

    constructor() {
        this.id = Date.now().toString()
    }

    hasPlayer(player) {
        return !!this.players.filter(p => p.id === player.id).length
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

    isFull() {
        return LOBBY_SETTINGS.maxPlayers === this.players.length
    }

    isEmpty() {
        return !this.players.length
    }
}

module.exports = {
    Lobby
}