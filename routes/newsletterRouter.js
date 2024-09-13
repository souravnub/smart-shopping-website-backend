const express = require("express");
const router = express.Router();
const authorizeUser = require("../middlewares/authorizeUser");
const {
    addOrRemoveNewsLetterUser,
    getAllNewsLetterUsers,
} = require("../controllers/newsletterController");

router.post("/addremove", addOrRemoveNewsLetterUser);
router.get("/all", authorizeUser, getAllNewsLetterUsers);

module.exports = router;
