const express = require("express");
const authorizeUser = require("../middlewares/authorizeUser");
const {
    addMessage,
    getAllMessages,
    deleteMessage,
    replyToMessage,
} = require("../controllers/messagesController");

const router = express.Router();

router.post("/add", addMessage);
router.get("/all", authorizeUser, getAllMessages);
router.post("/delete/:id", authorizeUser, deleteMessage);
router.post("/reply/:id", authorizeUser, replyToMessage);

module.exports = router;
