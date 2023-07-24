const EVENTS = {
    CONNECT_PLAYER: 'connectPlayer',
    DISCONNECTION_PLAYER: 'disconnectPlayer',
    JOIN_PLAYER_TO_PUBLIC_LOBBY: 'joinPlayerToPublicLobby',
    JOIN_PLAYER_TO_PRIVATE_LOBBY: 'joinPlayerToPrivateLobby',
    JOIN_PLAYER_TO_ROOM: 'joinPlayerToRoom',
    START_MATCH: 'startMatch',
    KICK_PLAYER_FROM_ROOM: 'stopSearch',
    LEAVE_PLAYER_FROM_PUBLIC_LOBBY: 'leavePlayerFromPublicLobby',
}

const MODE_PLAYERS_CNT = {
    'tdm': 6,
    'dm': 10,
    'td': 4,
}

const LOBBYS_SETTINGS = {
    maxPlayers: 10
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

    joinPlayerToRoom: {
        eventName: 'joinPlayerToPublicLobby',
        payload: {
            playerId: null,
            version: null,
            hasBots: null,
            gameMode: null,
            map: null,
        },
    }
}

module.exports = {
    EVENTS,
    MODE_PLAYERS_CNT,
    LOBBYS_SETTINGS,
    CLIENT_EVENTS,
}

// RESPONSE
// {
//     event: 'handShake'
//     payload: {}
// }

// REQUEST

// {
//     eventName: "joinPlayerToRoom",
//     payload: {
//         playerId,
//         version,
//         hasBots,
//         gameMode,
//         map,
//     }
// }

// {
//     eventName: "joinPlayerToPublicLobby",
//     payload: {
//         playerId,
//         version,
//     }
// }

// {
//     eventName: "joinPlayerToPrivateLobby",
//     payload: {
//         playerId,
//         version,
//         code,
//     }
// }

// {
//     eventName: "otherEvents",
//     payload: {}
// }