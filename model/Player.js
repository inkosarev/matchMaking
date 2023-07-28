class Player {
    id
    filter
    lastRoomId
    constructor(id, filter = {}) {
        this.id = id
        this.filter = filter
    }

    setFilter(filter) {
        this.filter = filter
    }

    setLastRoomId(roomId) {
        this.lastRoomId = roomId
    }
}

module.exports = {
    Player
}