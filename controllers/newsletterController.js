const NewsLetterModel = require("../models/NewsLetter");
const Users = require("../models/Users");

const addOrRemoveNewsLetterUser = async (req, res) => {
    const { email, name, action } = req.query;

    const isLoggedUser = await Users.findOne({ email: email });
    const user = await NewsLetterModel.findOne({ email: email });

    if (action === "add") {
        if (user) {
            res.status(409).json({
                success: false,
                message: "user with this email already exist.",
            });
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
                    console.log(err);
                    res.status(500).json({
                        success: false,
                        message: "some internal server error occured .",
                    });
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
                    console.log(err);
                    res.status(500).json({
                        success: false,
                        message:
                            "unable to remove from newsletter service due to some internal server error.",
                    });
                });
        } else {
            res.status(409).json({
                success: false,
                message: "no user found with this email to be removed...",
            });
        }
    } else {
        res.status(409).json({ success: false, message: "action is invalid" });
    }
};

const getAllNewsLetterUsers = async (req, res) => {
    try {
        if (req.is_admin) {
            const users = await NewsLetterModel.find().select(
                "_id user email createdAt"
            );

            res.status(200).json({ success: true, users });
        } else {
            res.status(401).json({
                success: false,
                message: "route is available to admin users only..",
            });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "some internal server error occured.",
        });
    }
};

module.exports = { addOrRemoveNewsLetterUser, getAllNewsLetterUsers };
