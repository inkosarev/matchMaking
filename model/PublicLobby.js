const { Lobby } = require('./Lobby')

class PublicLobby extends Lobby {
    constructor() {
        super.constructor()
    }
}

module.exports = {
    PublicLobby
}