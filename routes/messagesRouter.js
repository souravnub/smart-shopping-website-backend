const express = require("express");
const fetchUser = require("../middlewares/fetchUser");
const {
    addMessage,
    getAllMessages,
    deleteMessage,
    replyToMessage,
} = require("../controllers/messagesController");

const router = express.Router();

router.post("/add", addMessage);
router.get("/all", fetchUser, getAllMessages);
router.post("/delete/:id", fetchUser, deleteMessage);
router.post("/reply/:id", fetchUser, replyToMessage);

module.exports = router;
