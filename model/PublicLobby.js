const { Lobby } = require('./Lobby')

class PublicLobby extends Lobby {
    constructor() {
        super()
    }
}

module.exports = {
    PublicLobby
}