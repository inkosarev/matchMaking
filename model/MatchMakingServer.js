const {
    EVENTS,
    CLIENT_EVENTS,
    STATUS,
} = require('../constants.js')

const { Filter } = require('./Filter.js')
const { Room } = require('./Room.js')
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
    createPrivateLobby(payload) { }

    // Event
    findMatch(payload, connection) {
        let room
        const { gameMode, hasBots, version, playerId } = payload
        const player = this.players.filter(player => player.id === playerId)[0]
        player.filter = new Filter(gameMode, hasBots, version)

        if (!this.rooms.length) {
            room = new Room(payload)
            room.addPlayer(player)
            this.addRoom(room)
        } else {
            let relevantRooms = this.rooms.filter(room => {
                return this.compareFilters(room, player) && !room.isLocked() && !room.isFull()
            })

            if (relevantRooms.length) {
                room = relevantRooms[0]
                room.addPlayer(player)
            } else {
                room = new Room(payload)
                room.addPlayer(player)
                this.addRoom(room)
            }
        }
        const response = this.createResponseMessage('findMatch', STATUS.success, { roomId: room.id })
        this.notifyPlayersInRoom('playerFindMatch', room, player)
        connection.send(response)
    }

    // Event
    stopSearch(payload) { }

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

    addRoom(room) {
        this.rooms.push(room)
    }

    deletePublicLobby() { }

    createPrivateLobby() { }
    
    deletePrivateLobby() { }

    createRoom(player) { }

    deleteRoom(room) { }
 
    addPlayerToLobby() { }

    getRoomsByPlayerId(playerId) { }

    compareFilters(room, player) {
        let result = true
        const roomFilter = room.filter
        const playerFilter = player.filter

        for (let prop in roomFilter) {
            if (prop === 'map') return
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
            if (p.id === player.id) return
            this.playersConnections.get(p).send(JSON.stringify({
                eventName: eventName,
                status: STATUS.success,
                payload: {
                    msg: `Player ${player.id} has joined the lobby`
                }
            }))
        })
    }

    notifyPlayersInRoom(eventName, room, player) {
        room.players.forEach(p => {
            if (p.id === player.id) return
            this.playersConnections.get(p).send(JSON.stringify({
                eventName: eventName,
                status: STATUS.success,
                payload: {
                    msg: `Player ${player.id} has joined the room`
                }
            }))
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