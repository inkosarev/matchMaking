const MODE_PLAYERS_CNT = {
    'tdm': 6,
    'dm': 10,
    'td': 4,
}

const EVENT_TYPE ={
    response: 'response',
    notification: 'notification',
}

const LOBBY_SETTINGS = {
    maxPlayers: 10,
}

const STATUS = {
    success: 'success',
    fail: 'fail',
}

const EVENT = {
    connectPlayer: 'connectPlayer',
    disconnectPlayer: 'disconnectPlayer',
    joinPlayerToPublicLobby: 'joinPlayerToPublicLobby',
    joinPlayerToPrivateLobby: 'joinPlayerToPrivateLobby',
    leavePlayerFromPublicLobby: 'leavePlayerFromPublicLobby',
    leavePlayerFromPrivateLobby: 'leavePlayerFromPrivateobby',
    joinPlayerToRoom: 'joinPlayerToRoom',
    leavePlayerFromRoom: 'leavePlayerFromRoom',
    findMatch: 'findMatch',
    stopSearch: 'stopSearch',
}

const CLIENT_EVENT = {
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
    },

    stopSearch: {
        eventName: 'stopSearch',
        payload: {
            playerId: null,
        },
    },

    joinPlayerToPrivateLobby: {
        eventName: 'joinPlayerToPrivateLobby',
        payload: {
            code: null,
            playerId: null,
        },
    },
    
    leavePlayerFromPrivateLobby: {
        eventName: 'leavePlayerFromPrivateLobby',
        payload: {
            playerId: null,
        },
    },

    joinPlayerToRoom: {
        eventName: 'joinPlayerToRoom',
        payload: {
            playerId: null,
        },
    },

    leavePlayerFromRoom: {
        eventName: 'leavePlayerFromRoom',
        payload: {
            playerId: null,
        },
    },
}

module.exports = {
    EVENT,
    MODE_PLAYERS_CNT,
    LOBBY_SETTINGS,
    CLIENT_EVENT,
    STATUS,
    EVENT_TYPE,
}