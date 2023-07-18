const EVENTS = {
    PLAYER_CONNECTION: 'playerConnection',
    PLAYER_DISCONNECTION: 'playerDisconnection',
    JOIN_TO_PUBLIC_LOBBY: 'joinToPublicLobby',
    JOIN_TO_PUBLIC_LOBBY: 'joinToPublicLobby',
    JOIN_TO_PRIVATE_LOBBY: 'joinToPrivateLobby',
    JOIN_TO_ROOM: 'joinToRoom',
    START_MATCH: 'startMatch',
    STOP_SEARCH: 'stopSearch',
}

const MODE_PLAYERS_CNT = {
    'tdm': 6,
    'dm': 10,
    'td': 4,
}

module.exports = {
    EVENTS,
    MODE_PLAYERS_CNT,
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