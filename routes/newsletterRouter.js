const express = require("express");
const router = express.Router();
const {
    addOrRemoveNewsLetterUser,
    getAllNewsLetterUsers,
} = require("../controllers/newsletterController");
const authorizeAdmin = require("../middlewares/authorizeAdmin");

router.post("/addremove", addOrRemoveNewsLetterUser);
router.get("/all", authorizeAdmin, getAllNewsLetterUsers);

module.exports = router;
