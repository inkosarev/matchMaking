class Room {
    id
    map
    gameMode
    filter
    players = []

    constructor(player) {
        this.id = Date.now()
        this.players.push(player)
        this.filter = player.filter
        this.gameMode = player.filter.gameMode
        this.map = player.filter.map
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

    #playersCount() {
        return this.players.length
    }

    #maxPlayers() {
        return MODE_PLAYERS_CNT[this.mode]
    }

    #isLocked() {
        return false
    }

    #isFull() {
        this.maxPlayers == this.playersCount
    }

    #isAvailable() {
        return !this.isFull && !this.isLocked
    }
}

module.exports = {
    Room
}