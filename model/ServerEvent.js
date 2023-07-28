class ServerEvent {
    name
    type
    status
    payload

    constructor(name, type, status, payload) {
        this.name = name
        this.type = type
        this.status = status
        this.payload = payload || {}
    }
}

module.exports = {
    ServerEvent,
}