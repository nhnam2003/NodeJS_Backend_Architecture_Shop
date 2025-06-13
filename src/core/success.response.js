'use strict'

const StatusCode = {
    OK: 200,
    Created: 201,
    Accepted: 202,

}
const ReasonStatusCode = {
    OK: 'Success',
    Created: 'Created',
    Accepted: 'Accepted',

}

class SuccessResponse {
    constructor({ message, statusCode = StatusCode.OK, reasonMessage = ReasonStatusCode.OK, metadata = {} }) {
        this.message = !message ? reasonMessage : message
        this.status = statusCode
        this.metadata = metadata
    }
    send(res, headers = {}) {
        return res.status(this.status).json(this)
    }
}

class OK extends SuccessResponse {
    constructor({ message, metadata }) {
        super({ message, metadata })
    }
}
class CREATED extends SuccessResponse {
    constructor({ message, statusCode = StatusCode.Created, reasonMessage = ReasonStatusCode.Created, metadata }) {
        super({ message, statusCode, reasonMessage, metadata })
    }
}


module.exports = {
    OK, CREATED,
    SuccessResponse
}