const express = require("express");
const authorizeUser = require("../middlewares/authorizeUser");
const {
    addMessage,
    getAllMessages,
    deleteMessage,
    replyToMessage,
} = require("../controllers/messagesController");
const authorizeAdmin = require("../middlewares/authorizeAdmin");

const router = express.Router();

router.post("/add", addMessage);

router.get("/all", authorizeAdmin, getAllMessages);
router.post("/delete/:id", authorizeAdmin, deleteMessage);
router.post("/reply/:id", authorizeAdmin, replyToMessage);

module.exports = router;
