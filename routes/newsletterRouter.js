const express = require("express");
const router = express.Router();
const fetchUser = require("../middlewares/fetchUser");
const {
    addOrRemoveNewsLetterUser,
    getAllNewsLetterUsers,
} = require("../controllers/newsletterController");

router.post("/addremove", addOrRemoveNewsLetterUser);
router.get("/all", fetchUser, getAllNewsLetterUsers);

module.exports = router;
