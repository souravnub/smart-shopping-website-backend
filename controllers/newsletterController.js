const ConflictError = require("../errors/conflict-error");
const InternalServerError = require("../errors/internal-server-error");
const NotFoundError = require("../errors/not-found-error");
const NewsLetterModel = require("../models/NewsLetter");
const Users = require("../models/Users");

const addOrRemoveNewsLetterUser = async (req, res, next) => {
    const { email, name, action } = req.query;

    const isLoggedUser = await Users.findOne({ email: email });
    const user = await NewsLetterModel.findOne({ email: email });

    if (action === "add") {
        if (user) {
            next(new ConflictError("User with this emial already exsits"));
        } else {
            NewsLetterModel.create({ user: name, email: email })
                .then(async () => {
                    res.json({
                        success: true,
                        message: "added to newsletter service !",
                    });

                    if (isLoggedUser) {
                        await Users.findByIdAndUpdate(isLoggedUser._id, {
                            "news letter holder": true,
                        });
                    }
                })
                .catch((err) => {
                    next(new InternalServerError());
                });
        }
    } else if (action === "remove") {
        if (user) {
            NewsLetterModel.findOneAndDelete({ email: email })
                .then(async () => {
                    if (isLoggedUser) {
                        await Users.findByIdAndUpdate(isLoggedUser._id, {
                            "news letter holder": false,
                        });
                    }
                    res.json({
                        success: true,
                        message: "removed from newsletter service.",
                    });
                })
                .catch((err) => {
                    next(new InternalServerError());
                });
        } else {
            next(new NotFoundError("No user found with given email"));
        }
    } else {
        next(new ConflictError("Actions is invalid"));
    }
};

const getAllNewsLetterUsers = async (req, res, next) => {
    try {
        const users = await NewsLetterModel.find().select(
            "_id user email createdAt"
        );

        res.status(200).json({ success: true, users });
    } catch (error) {
        next(new InternalServerError());
    }
};

module.exports = { addOrRemoveNewsLetterUser, getAllNewsLetterUsers };
