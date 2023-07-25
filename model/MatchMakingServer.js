const {
    EVENTS,
    CLIENT_EVENTS,
    STATUS,
} = require('../constants.js')

const {  } = require('../constants.js')
const { Player } = require('./Player.js')
const { PublicLobby } = require('./PublicLobby.js')

class MatchMakingServer {
    players = []
    rooms = []
    publicLobbys = []
    privateLobbys = []
    playersConnections = new Map()

    eventHandler(event, connection) {
            const { eventName, payload } = event
        if (this.validateEventData(event, connection)) {
            this[(eventName)](payload, connection)
        } else {
            const response = this.createResponseMessage(eventName, STATUS.fail, payload)
            connection.send(response)
        }
    }
    
    createResponseMessage(eventName, status, payload) {
        return JSON.stringify({
            eventName,
            status,
            payload,
        })
    }

    validateEventData(event, connection) {
        let result = true
        if (!Object.values(EVENTS).includes(event.eventName)) return false
        const eventTemplate = CLIENT_EVENTS[event.eventName]
        if (event.payload) {
            for (let prop in eventTemplate.payload) {
                if (!(prop in event.payload)) {
                    result = false
                    break
                }
            }
        }

        if (!result) {
            const response = this.createResponseMessage(event.eventName, STATUS.fail, { msg: "Invalid data" })
            connection.send(response)
        }

        return result
    }

    disconnectPlayer(connection) {
        for (let entry of this.playersConnections) {
            const key = entry[0]
            const value = entry[1]
            if (value === connection) {
                this.leavePlayerFromPublicLobby({ playerId: key.id })
                this.deletePlayer(key)
                this.playersConnections.delete(key)
                break
            }
        }
    }

    rejoinPlayerToMatch(playerId) {

    }

    // Event
    connectPlayer(payload, connection) {
        try {
            const player = this.createPlayer(payload.playerId)
            this.createPlayerConnection(player, connection)
            connection.send(this.createResponseMessage('connectPlayer', STATUS.success, {}))
        } catch(e) {
            console.error(e)
        }
    }

    // Event
    joinPlayerToPublicLobby(payload, connection) {
        let lobbyId
        const { playerId } = payload
        const player = this.players.filter(player => player.id === playerId)[0]

        const lobbys = this.publicLobbys
            .filter(lobby => {
                const isFull = lobby.isFull()
                const isLocked = lobby.isLocked()
                return !isFull && !isLocked
            })
            .sort((a, b) => b.players.length - a.players.length)
        
        if (lobbys.length) {
            lobbys[0].addPlayer(player)
            this.notifyPlayersInLobby('playerJoinToLobby', lobbys[0], player)
            lobbyId = lobbys[0].id
        } else {
            const lobby = this.createPublicLobby()
            lobby.addPlayer(player)
            lobbyId = lobby.id
        }

        const response = this.createResponseMessage('joinPlayerToPublicLobby', STATUS.success, { lobbyId })
        connection.send(response)
    }

    // Event
    leavePlayerFromPublicLobby(payload) {
        const { playerId } = payload
        const player = this.players.filter(player => player.id === playerId)[0]
        const lobbys = this.publicLobbys.filter(lobby => lobby.hasPlayer(player))
        lobbys.forEach(lobby => { 
            this.notifyPlayersInLobby("playerLeaveLobby", lobby, player)
            lobby.kickPlayer(player)
        })
    }
    
    // Event
    joinPlayerToPrivateLobby(payload) { }

    // Event
    createPrivateLobbyEvent(payload) { }

    // Event
    findMatchEvent(payload) {
        
    }

    // Event
    stopSearchEvent(payload) { }

    createPlayerConnection(player, connection) {
        this.playersConnections.set(player, connection)
    }

    createPlayer(id) {
        const player = new Player(id)
        this.players.push(player)
        return player
    }

    deletePlayer(player) {
        const array = Array.from(this.playersConnections.keys())
        const index = array.indexOf(player);
        this.players.splice(index, 1)
    }
    
    createPublicLobby() {
        const lobby = new PublicLobby()
        this.publicLobbys.push(lobby)
        return lobby
    }

    deletePublicLobby() { }

    createPrivateLobby() { }
    
    deletePrivateLobby() { }

    createRoom(player) { }

    deleteRoom(room) { }
 
    addPlayerToRoom(player, connection) {
        // Создать комнату если их нет
        if (!this.rooms.length) {
            const room = new Room(player)
            this.rooms.push(room)

            const event = {
                type: 'join',
                status: 'success',
            }
            this.notifyPlayersInRoom(event, room) // Оповестить игроков 
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

    addPlayerToLobby() { }

    getRoomsByPlayerId(playerId) { }

    compareFilters(room, player) {
        let result = true
        const roomFilter = room.filter
        const playerFilter = player.filter

        for (let prop in roomFilter) {
            if (playerFilter[prop] != roomFilter[prop]) result = false
        }

        return result
    }

    getRelevantRooms(player) {
        return this.rooms.filter(room => {
            return this.compareFilters(room, player)
        })
    }

    notifyPlayersInLobby(eventName, lobby, player) {
        lobby.players.forEach(p => {
            this.playersConnections.get(p).send(JSON.stringify({
                eventName: eventName,
                status: STATUS.success,
                payload: {
                    msg: `Player ${player.id} has joined the lobby`
                }
            }))
        })
    }

    // Отправить всем игрокам в комнате событие
    notifyPlayersInRoom(event, room) {
       room.players.forEach(player => {
        this.playersConnections.get(player)
        .send(JSON.stringify({ event, room }))
       });
    }

    getPlayerById(id) {
        const players = Map.keys(this.playersConnections)
        const player = players.filter(p => id === p.id)
        return player.length ? player[0] : false
    }
}

module.exports = {
    MatchMakingServer
}