const { StatusCodes } = require("http-status-codes");

class InternalServerError extends Error {
    constructor(message) {
        this.message = "Some error on server!";
        this.statusCode = StatusCodes.INTERNAL_SERVER_ERROR;
    }
}
module.exports = InternalServerError;
