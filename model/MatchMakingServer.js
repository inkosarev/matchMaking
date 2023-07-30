const {
    EVENT,
    CLIENT_EVENT,
    STATUS,
    EVENT_TYPE,
} = require('../constants.js')

const { Filter } = require('./Filter.js')
const { Room } = require('./Room.js')
const { Player } = require('./Player.js')
const { PublicLobby } = require('./PublicLobby.js')
const { PrivateLobby } = require('./PrivateLobby.js')
const { ServerEvent } = require('./ServerEvent.js')

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
            const response = new ServerEvent(eventName, EVENT_TYPE.response, STATUS.fail)
            connection.send(JSON.stringify(response))
        }
    }
    
    validateEventData(event, connection) {
        let result = true
        if (!Object.values(EVENT).includes(event.eventName)) return false
        const eventTemplate = CLIENT_EVENT[event.eventName]
        if (event.payload) {
            for (let prop in eventTemplate.payload) {
                if (!(prop in event.payload)) {
                    result = false
                    break
                }
            }
        }

        if (!result) {
            const response = new ServerEvent(
                event.eventName,
                EVENT_TYPE.response,
                STATUS.fail,
                { msg: "Invalid data" }
            )
            connection.send(JSON.stringify(response))
        }

        return result
    }

    disconnectPlayer(connection) {
        for (let entry of this.playersConnections) {
            const key = entry[0]
            const value = entry[1]
            if (value === connection) {
                this.leavePlayerFromPublicLobby({ playerId: key.id }, connection)
                this.deletePlayer(key)
                this.playersConnections.delete(key)
                break
            }
        }
    }

    // Event
    connectPlayer(payload, connection) {
        try {
            const player = this.createPlayer(payload.playerId)
            const response = new ServerEvent(EVENT.connectPlayer, EVENT_TYPE.response, STATUS.success)
            this.createPlayerConnection(player, connection)
            connection.send(JSON.stringify(response))
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
            .filter(lobby => !lobby.isFull())
            .sort((a, b) => b.players.length - a.players.length)
        
        if (lobbys.length) {
            const notification = new ServerEvent(
                EVENT.joinPlayerToPublicLobby,
                EVENT_TYPE.notification,
                STATUS.success,
                { player }
            )
            lobbys[0].addPlayer(player)
            this.notifyPlayersInLobby(notification, lobbys[0], player)
            lobbyId = lobbys[0].id
        } else {
            const lobby = this.createPublicLobby()
            lobby.addPlayer(player)
            lobbyId = lobby.id
        }

        const response = new ServerEvent(
            EVENT.joinPlayerToPublicLobby,
            EVENT_TYPE.response,
            STATUS.success,
            { lobbyId }
        )

        connection.send(JSON.stringify(response))
    }

    // Event
    leavePlayerFromPublicLobby(payload, connection) {
        const { playerId } = payload
        const player = this.players.filter(player => player.id === playerId)[0]
        const lobbys = this.publicLobbys.filter(lobby => lobby.hasPlayer(player))
        
        const notification = new ServerEvent(
            EVENT.leavePlayerFromPrivateLobby,
            EVENT_TYPE.notification,
            STATUS.success, 
        )

        const response = new ServerEvent(
            EVENT.leavePlayerFromPrivateLobby,
            EVENT_TYPE.response,
            STATUS.success, 
        )

        connection.send(JSON.stringify(response))
        lobbys.forEach(lobby => { 
            lobby.kickPlayer(player)
            this.notifyPlayersInLobby(notification, lobby, player)
        })
    }

    // Event
    rejoinPlayerToMatch(payload, connection) { }

    // Event
    joinPlayerToPrivateLobby(payload, connection) {
        const { playerId, code } = payload
        const player = this.players.filter(player => player.id === playerId)[0]
        const lobby = this.privateLobbys.filter(lobby => lobby.code === code)[0]
        if (lobby) {
            lobby.addPlayer(player)

            const response = new ServerEvent(
                EVENT.joinPlayerToPrivateLobby,
                EVENT_TYPE.response,
                STATUS.success,
                { lobbyId: lobby.id }
            )
    
            const notification = new ServerEvent(
                EVENT.joinPlayerToPrivateLobby,
                EVENT_TYPE.notification,
                STATUS.success,
                {
                    player,
                    msg: `Player has joined the lobby`,
                }
            )
            
            connection.send(JSON.stringify(response))
            this.notifyPlayersInLobby(notification, lobby, player)
        } else {
            const response = new ServerEvent(
                EVENT.joinPlayerToPrivateLobby,
                EVENT_TYPE.response,
                STATUS.fail,
                {
                    code,
                    msg: "Invalid code",
                }
            )
    
            connection.send(JSON.stringify(response))
        }
    }

    // Event
    createPrivateLobby(payload, connection) {
        const { playerId } = payload
        const player = this.players.filter(player => player.id === playerId)[0]
        const lobby = new PrivateLobby()
        this.privateLobbys.push(lobby)
        lobby.addPlayer(player)
        
        const response = new ServerEvent(
            EVENT.createPrivateLobby,
            EVENT_TYPE.response,
            STATUS.success,
            {
                lobbyId: lobby.id,
                code: lobby.code,
            }
        )

        connection.send(JSON.stringify(response))
    }

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

        const response = new ServerEvent(
            EVENT.findMatch,
            EVENT_TYPE.response,
            STATUS.success,
            { roomId: room.id }
        )

        const notification = new ServerEvent(
            EVENT.findMatch,
            EVENT_TYPE.notification,
            STATUS.success,
            {
                player,
                msg: `Player has joined the room`,
            }
        )

        connection.send(JSON.stringify(response))
        this.notifyPlayersInRoom(notification, room, player)
    }

    // Event
    stopSearch(payload, connection) {
        const { playerId } = payload
        const player = this.players.filter(p => p.id === playerId)[0]
        const rooms = this.rooms.filter(room => room.hasPlayer(player))

        const response = new ServerEvent(
            EVENT.stopSearch,
            EVENT_TYPE.response,
            STATUS.success,
        )

        const notification = new ServerEvent(
            EVENT.stopSearch,
            EVENT_TYPE.notification,
            STATUS.success,
            {
                player,
                msg: `Player has left the room`,
            }
        )

        connection.send(JSON.stringify(response))
        rooms.forEach(room => {
            room.kickPlayer(player)
            this.notifyPlayersInRoom(notification, room, player)
        })
    }

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

    deletePublicLobby(lobby) {
        const index = this.publicLobbys.indexOf(lobby);
        this.publicLobbys.splice(index, 1)
    }
    
    deletePrivateLobby(lobby) {
        const index = this.privateLobbys.indexOf(lobby);
        this.privateLobbys.splice(index, 1)
    }

    deleteRoom(room) {
        const index = this.rooms.indexOf(room);
        this.rooms.splice(index, 1)
    }
 
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

    notifyPlayersInLobby(notification, lobby, player) {
        lobby.players.forEach(p => {
            if (p.id === player.id) return
            this.playersConnections
            .get(p)
            .send(JSON.stringify(notification))
        })
    }

    notifyPlayersInRoom(notification, room, player) {
        room.players.forEach(p => {
            if (p.id === player.id) return
            this.playersConnections
            .get(p)
            .send(JSON.stringify(notification))
       });
    }
}

module.exports = {
    MatchMakingServer
}