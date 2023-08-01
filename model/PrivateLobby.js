const { Lobby } = require('./Lobby')

class PrivateLobby extends Lobby {
    code = ''
    constructor() {
        super()
        this.generateCode()
    }

    generateCode() {
        const characters = '0123456789abcdefghijklmnopqrstuvwxyz';
        
        for (let i = 0; i < 6; i++) {
            const randomIndex = Math.floor(Math.random() * characters.length);
            this.code += characters[randomIndex];
        }
        
        return this.code;
    }
}

module.exports = {
    PrivateLobby
}