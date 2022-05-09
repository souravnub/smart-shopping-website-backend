var jwt = require("jsonwebtoken");
const Users = require("../models/Users");

async function userFunc(req, res, next) {
    // getting user from the authtoken and then setting the token

    let token = req.header("token");

    if (token === null) {
        req.is_admin = false;
    } else {
        try {
            // the below line of code will verify a token and will return the corresponding payload_data to that token and if token is invalid then will give an error that we will catch using try-catch

            let data_from_payload = jwt.verify(
                token,
                process.env.JWT_SECRET_KEY
            );

            const user = await Users.findById({
                _id: data_from_payload.userId,
            });
            const is_admin = user.is_admin;

            req.is_admin = is_admin;
        } catch (error) {
            req.is_admin = false;
        }
    }

    next();
}

module.exports = userFunc;
