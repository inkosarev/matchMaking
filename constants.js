const MODE_PLAYERS_CNT = {
    'tdm': 6,
    'dm': 10,
    'td': 4,
}

const LOBBY_SETTINGS = {
    maxPlayers: 10
}

const STATUS = {
    success: 'success',
    fail: 'fail',
}

const EVENTS = {
    CONNECT_PLAYER: 'connectPlayer',
    DISCONNECT_PLAYER: 'disconnectPlayer',
    JOIN_PLAYER_TO_PUBLIC_LOBBY: 'joinPlayerToPublicLobby',
    JOIN_PLAYER_TO_PRIVATE_LOBBY: 'joinPlayerToPrivateLobby',
    JOIN_PLAYER_TO_ROOM: 'joinPlayerToRoom',
    FIND_MATCH: 'findMatch',
    KICK_PLAYER_FROM_ROOM: 'stopSearch',
    LEAVE_PLAYER_FROM_PUBLIC_LOBBY: 'leavePlayerFromPublicLobby',
}

const RESPONSE = {

}

const CLIENT_EVENTS = {
    connectPlayer: {
        eventName: 'connectPlayer',
        payload: { playerId: null },
    },

    joinPlayerToPublicLobby: {
        eventName: 'joinPlayerToPublicLobby',
        payload: {
            playerId: null,
        },
    },
    
    leavePlayerFromPublicLobby: {
        eventName: 'leavePlayerFromPublicLobby',
        payload: {
            playerId: null,
        },
    },

    findMatch: {
        eventName: 'findMatch',
        payload: {
            playerId: null,
            version: null,
            hasBots: null,
            gameMode: null,
        },
    }
}

module.exports = {
    EVENTS,
    MODE_PLAYERS_CNT,
    LOBBY_SETTINGS,
    CLIENT_EVENTS,
    STATUS,
    RESPONSE,
}