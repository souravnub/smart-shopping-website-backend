const Messages = require("../models/Messages");

const addMessage = async (req, res) => {
    try {
        await Messages.create({
            user: req.body.user,
            email: req.body.email,
            message: req.body.message,
        });
        res.status(200).json({
            success: true,
            message:
                "your message had been recorded ! we will try to respond soon !",
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({
            success: false,
            message:
                "some internal server error occured! message cannot be recorded.",
        });
    }
};

const getAllMessages = async (req, res) => {
    try {
        if (req.is_admin) {
            const messages = await Messages.find({}).sort({ createdAt: "-1" });
            res.json({ success: true, messages });
        } else {
            res.status(401).json({
                success: false,
                message: "route is available to admin users only",
            });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message:
                "some internal server error occured ... unable to fetch messages",
        });
    }
};

const deleteMessage = (req, res) => {
    try {
        if (req.is_admin) {
            const { id } = req.params;

            Messages.findByIdAndDelete(id)
                .then(() => {
                    res.json({
                        success: true,
                        message: "message deleted successfully",
                    });
                })
                .catch((err) => {
                    console.log(err);
                    res.status(500).json({
                        success: false,
                        message:
                            "some unknown error occured... cannot delete message",
                    });
                });
        } else {
            res.status(401).json({
                success: false,
                message: "route is available to admin users only...",
            });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message:
                "some internal server error occured ... unable to fetch messages",
        });
    }
};

const replyToMessage = (req, res) => {
    try {
        if (req.is_admin) {
            const { id } = req.params;
            Messages.findByIdAndUpdate(id, {
                responded: true,
                response_message: req.body.reply,
            })
                .then(() =>
                    res.json({
                        success: true,
                        message: "message replied successfully",
                    })
                )
                .catch((err) => {
                    console.log(err);
                    res.status(500).json({
                        success: false,
                        message:
                            "some issue occured while updating the message .... ",
                    });
                });
        } else {
            res.status(401).json({
                success: false,
                message: "route is available to admin users only",
            });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message:
                "some internal server error occured.. cannot reply to the message",
        });
    }
};

module.exports = { addMessage, getAllMessages, deleteMessage, replyToMessage };
