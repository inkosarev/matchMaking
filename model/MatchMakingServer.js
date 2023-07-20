const { EVENTS } = require('../constants.js')
const { MODE_PLAYERS_CNT } = require('../constants.js')
const { Player } = require('./Player.js')

class MatchMakingServer {
    players = []
    rooms = []
    publicLobbys = []
    privateLobbys = []
    playersConnections = new Map()

    constructor() { }
    
    eventHandler(event, connection) {
        const { eventName, payload } = event
        this[eventName](payload, connection)
    }

    disconnectPlayer(connection) {
        for (let entry of this.playersConnections) {
            const key = entry[0]
            const value = entry[1]
            if (value === connection) {
                this.#deletePlayer(key)
                this.playersConnections.delete(key)
                break
            }
        }
    }

    // Event
    connectPlayer(payload, connection) {
        try {
            const player = this.#createPlayer(payload.playerId)
            this.#createPlayerConnection(player, connection)
        } catch(e) {
            console.error(e)
        }
    }

    // Event
    #joinPlayerToRoom(player, payload = {}) {
        // Создать комнату если их нет
        if (!this.rooms.length) {
            const room = new Room(player)
            this.rooms.push(room)

            const event = {
                type: 'join',
                status: 'success',
            }
            this.#notifyPlayersInRoom(event, room) // Оповестить игроков 
        } else {
            // Выбрать подходящие игроку комнаты
            let relevantRooms = this.rooms.filter(room => {
                //TO DO не надо фильтровать по карте
                return (JSON.stringify(room.filter) === JSON.stringify(player.filter) && room.isAvailable())
            })

            if (relevantRooms.length) {
            // Если таковые есть поместить в первую из них игрока
                if (!relevantRooms[0].isLocked && !rel) {
                    relevantRooms[0].rooms.push(player)
                }
            } else {
            // Если таковых нет создать новую
                this.rooms.push(new Room(player))
            }
        }
    }

    // Event
    #joinPlayerToPublicLobby({ player }) { }
    
    // Event
    #joinPlayerToPrivateLobby({ player, payload = {} }) { }

    // Event
    #createPrivateLobbyEvent({ player, payload = {} }) { }

    // Event
    #startMatchEvent(player) { }

    // Event
    #stopSearchEvent(player) { }

    #createPlayerConnection(player, connection) {
        this.playersConnections.set(player, connection)
    }

    #createPlayer(id) {
        const player = new Player(id)
        this.players.push(player)
        return player
    }

    #deletePlayer(player) {
        const array = Array.from(this.playersConnections.keys())
        const index = array.indexOf(player);
        this.players.splice(index, 1)
     }
    
    #createRoom(player) { }

    #deleteRoom(room) { }

    #getRoomsByPlayerId(playerId) { }

    #isRoomSuitableForPlayer(room, player) { }

    // Отправить всем игрокам в комнате событие
    #notifyPlayersInRoom(event, room) {
       room.players.forEach(player => {
        this.playersConnections.get(player).send(JSON.stringify({
            event,
            room,
           }))
       });
    }

    #getPlayerById(id) {
        const players = Map.keys(this.playersConnections)
        const player = players.filter(p => id === p.id)
        return player.length ? player[0] : false
    }
}

module.exports = {
    MatchMakingServer
}