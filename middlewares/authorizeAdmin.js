const NotAuthorizedError = require("../errors/not-authorized-error");

async function authorizeAdmin(req, res, next) {
    if (!req.is_admin) {
        const err = new NotAuthorizedError(
            "Not authorized to access admin resources"
        );
        next(err);
    }
    next();
}

module.exports = authorizeAdmin;
