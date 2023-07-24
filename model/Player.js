class Player {
    id
    filter
    lastRoom
    constructor(id, filter = {}) {
        this.id = id
        this.filter = filter
    }

    setFilter(filter) {
        this.filter = filter
    }

    setLastRoom(room) {
        this.lastRoom = room
    }
}

module.exports = {
    Player
}