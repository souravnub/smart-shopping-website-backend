const { StatusCodes } = require("http-status-codes");

const errorHandler = (err, req, res, next) => {
    let customError = {
        statusCode: err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
        message: err.message || "something went wrong please try again",
        ...err,
    };

    return res.status(customError.statusCode).json({ ...customError });
};
module.exports = errorHandler;
