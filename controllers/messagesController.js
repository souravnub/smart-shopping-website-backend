const InternalServerError = require("../errors/internal-server-error");
const NotAuthorizedError = require("../errors/not-authorized-error");
const Messages = require("../models/Messages");

const addMessage = async (req, res, next) => {
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
        next(new InternalServerError());
    }
};

const getAllMessages = async (req, res, next) => {
    try {
        const messages = await Messages.find({}).sort({ createdAt: "-1" });
        res.json({ success: true, messages });
    } catch (error) {
        next(new InternalServerError());
    }
};

const deleteMessage = async (req, res, next) => {
    try {
        const { id } = req.params;

        await Messages.findByIdAndDelete(id);

        res.json({
            success: true,
            message: "message deleted successfully",
        });
    } catch (error) {
        next(new InternalServerError());
    }
};

const replyToMessage = async (req, res, next) => {
    const { id } = req.params;

    try {
        await Messages.findByIdAndUpdate(id, {
            responded: true,
            response_message: req.body.reply,
        });
        res.json({
            success: true,
            message: "message replied successfully",
        });
    } catch (err) {
        next(new InternalServerError());
    }
};

module.exports = { addMessage, getAllMessages, deleteMessage, replyToMessage };
