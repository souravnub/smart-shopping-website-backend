const express = require("express");
const fetchUser = require("../middlewares/fetchUser");
const Messages = require("../models/Messages");

const router = express.Router();

// adding a new message
router.post("/add", async (req, res) => {
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
});

// getting all the messages
router.get("/all", fetchUser, async (req, res) => {
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
});

// deleting a message
router.post("/delete/:id", fetchUser, (req, res) => {
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
});

// replying to a message

router.post("/reply/:id", fetchUser, (req, res) => {
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
});

module.exports = router;
