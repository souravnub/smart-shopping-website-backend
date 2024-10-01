const Users = require("../models/Users");
var jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const BadRequestError = require("../errors/bad-request-error");
const NotFoundError = require("../errors/not-found-error");
const InternalServerError = require("../errors/internal-server-error");

const signUp = async (req, res, next) => {
    const found = await Users.findOne({ email: req.body.email });
    if (found === null) {
        const body = req.body;
        let salt = await bcrypt.genSalt(10);
        let hash_pass = await bcrypt.hash(body.password, salt);

        const user_created = await Users.create({
            user_img: body.user_img,
            user: body.user,
            password: hash_pass,
            email: body.email,
            phone: body.phone,
            location_info: {
                state: body.location_info.state,
                city: body.location_info.city,
                pincode: body.location_info.pincode,
                address: body.location_info.address,
            },
        });

        const authtoken = jwt.sign(
            { userId: user_created._id },
            process.env.JWT_SECRET_KEY
        );

        res.status(200).json({
            success: true,
            message: `you had been signed up succesfully.`,
            authtoken,
        });
    } else {
        next(
            new BadRequestError(
                "Email had already been used !! Please Try to use another one."
            )
        );
    }
};

const login = async (req, res, next) => {
    const body = req.body;

    const user = await Users.findOne({ email: body.email });

    if (user !== null) {
        const comparison = await bcrypt.compare(body.password, user.password);

        if (comparison) {
            const authtoken = jwt.sign(
                { userId: user._id },
                process.env.JWT_SECRET_KEY
            );

            res.status(200).json({
                success: true,
                message: "loged in successfully!",
                authtoken,
            });
        } else {
            next(new BadRequestError("Invalid password"));
        }
    } else {
        next(new NotFoundError("No user found with this emial"));
    }
};

const getUser = async (req, res, next) => {
    try {
        const user = await Users.findById(req.userId).select("-password");
        res.status(200).json({ success: true, user });
    } catch (error) {
        next(new InternalServerError());
    }
};

const getAllUsers = async (req, res, next) => {
    try {
        const users = await Users.find({}).select(
            "-location_info -password -__v"
        );
        res.status(200).json({ success: true, users });
    } catch (err) {
        next(new InternalServerError());
    }
};

const deleteUser = async (req, res, next) => {
    const userId = req.params.id;

    Users.findByIdAndDelete(userId)
        .then(() =>
            res.status(200).json({
                success: true,
                message: "user deleted successfully!",
            })
        )
        .catch((err) => {
            next(new InternalServerError());
        });
};

const promoteUserToAdmin = async (req, res, next) => {
    const { id } = req.params;

    Users.findByIdAndUpdate(id, { is_admin: true })
        .then(() => {
            res.status(200).json({
                success: true,
                message: "user promoted successfully !",
            });
        })
        .catch((err) => {
            next(new InternalServerError());
        });
};

const updateUser = (req, res, next) => {
    Users.findByIdAndUpdate(req.userId, req.body)
        .then(() => {
            res.status(200).json({
                success: true,
                message: "information updated successfully....",
            });
        })
        .catch((err) => {
            next(new InternalServerError());
        });
};

module.exports = {
    signUp,
    login,
    getUser,
    getAllUsers,
    deleteUser,
    promoteUserToAdmin,
    updateUser,
};
