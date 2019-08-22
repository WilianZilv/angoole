module.exports = class Sessions {
    constructor() {
        this.sessions = {}
    }
    set(id, value) {
        this.sessions[id] = value
    }
    get(id) {
        return this.sessions[id]
    }
    start(id) {
        if (!this.get(id)) {
            this.set(id, 1)
            return this.get(id)
        } else {
            return false
        }
    }
    finish(id) {
        if (this.get(id)) {
            delete this.sessions[id]
        }
    }
}

