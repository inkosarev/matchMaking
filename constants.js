const EVENTS = {
    CONNECT_PLAYER: 'connectPlayer',
    DISCONNECTION_PLAYER: 'disconnectPlayer',
    JOIN_JOIN_PLAYER_TO_PUBLIC_LOBBY: 'joinPlayerToPublicLobby',
    JOIN_PLAYER_TO_PRIVATE_LOBBY: 'joinPlayerToPrivateLobby',
    JOIN_PLAYER_TO_ROOM: 'joinPlayerToRoom',
    START_MATCH: 'startMatch',
    KICK_PLAYER_FROM_ROOM: 'stopSearch',
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