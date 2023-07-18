class Lobby {
    id
    host
    players = []

    constructor(player) {
        this.id = Date.now()
        this.players.push(player)
    }
    
    serialize() {
        return {
            id: this.id,
            map: this.map,
            gameMode: this.gameMode,
            playersCount: this.playersCount(),
            maxPlayers: this.maxPlayers(),
        }
    }

    setHost(player) {
        this.host = player
    }

    lock() {
        this.isLocked = true
    }

    #playersCount() {
        return this.players.length
    }

    #maxPlayers() {
        return modePlayersCount[this.mode]
    }

    #isLocked() {
        return false
    }

    #isFull() {
        this.maxPlayers == this.playersCount
    }
}

module.exports = {
    Lobby
}