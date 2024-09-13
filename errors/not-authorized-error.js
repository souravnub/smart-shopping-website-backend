const { StatusCodes } = require("http-status-codes");

class NotAuthorizedError extends Error {
    constructor(message) {
        super(message);
        this.statusCode = StatusCodes.UNAUTHORIZED;
    }
}
module.exports = NotAuthorizedError;
