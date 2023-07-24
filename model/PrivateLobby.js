const { Lobby } = require('./Lobby')

class PrivateLobby extends Lobby {
    code
    constructor() {
        super()
    }
}

module.exports = {
    PrivateLobby
}