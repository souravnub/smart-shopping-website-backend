var jwt = require("jsonwebtoken");
const Users = require("../models/Users");
const NotAuthorizedError = require("../errors/not-authorized-error");

async function authorizeUser(req, res, next) {
    let token = req.header("token");

    if (!token) {
        throw new NotAuthorizedError("Not authorized!");
    }

    try {
        let { userId } = jwt.verify(token, process.env.JWT_SECRET_KEY);
        const user = await Users.findById(userId);

        if (!user) {
            throw new NotAuthorizedError("Not authorized!");
        }

        req.is_admin = user.is_admin;
        req.userId = user._id;
    } catch (error) {
        req.is_admin = false;
    }

    next();
}

module.exports = authorizeUser;
