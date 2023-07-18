class Player {
    id
    filter
    constructor(id, filter = {}) {
        this.id = id
        this.filter = filter
    }

    setFilter(filter) {
        this.filter = filter
    }
}

module.exports = {
    Player
}