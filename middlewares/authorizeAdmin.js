const NotAuthorizedError = require("../errors/not-authorized-error");
const authorizeUser = require("./authorizeUser");

async function authorizeAdmin(req, res, next) {
    authorizeUser(req, res, function () {
        if (!req.is_admin) {
            const err = new NotAuthorizedError(
                "Not authorized to access admin resources"
            );
            next(err);
        }
        next();
    });
}

module.exports = authorizeAdmin;
