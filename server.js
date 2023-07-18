'use strict'
const WebSocket = require('websocket').server
const http = require('http')

const { MatchMakingServer } = require('./model/MatchMakingServer.js')

const matchMaking = new MatchMakingServer()

const server = http.createServer((req, res) => {
    res.writeHead(200)
    if (req.url === '/admin') {
        res.end(JSON.stringify({
            rooms: matchMaking.rooms,
            publicLobbys: matchMaking.publicLobbys,
            privateLobbys: matchMaking.privateLobbys,
            players: matchMaking.players,
            playersConnections: Array.from(matchMaking.playersConnections.keys())
        }))
      } else {
        res.end("go to /admin")
      }
})

server.listen(8000, () => {
    console.log('Listen port 8000')
})

const ws = new WebSocket({
    httpServer: server,
    autoAcceptConnections: false,
})

ws.on('request', req => {
    const connection = req.accept('', req.origin)

    // Message
    connection.on('message', message => {
        const dataName = message.type + 'Data'
        const data = message[dataName]
        const requestData = JSON.parse(data)
        console.log(requestData)
        matchMaking.eventHandler(requestData, connection)
    })

    // Close
    connection.on('close', (reasonCode, description) => {
        matchMaking.disconnectPlayer(connection)
        console.dir({reasonCode, description})
    })
})