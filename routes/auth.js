const express = require("express");
const Users = require("../models/Users");
const bcrypt = require("bcryptjs");
var jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const fetchUser = require("../middlewares/fetchUser");

dotenv.config();
const router = express.Router();

router.post("/signup", async (req, res) => {
    const found = await Users.findOne({ email: req.body.email });
    if (found === null) {
        const body = req.body;
        let salt = await bcrypt.genSalt(10);
        let hash_pass = await bcrypt.hash(body.password, salt);

        const user_created = await Users.create({
            user_img: body.user_img,
            user: body.user,
            password: hash_pass,
            email: body.email,
            phone: body.phone,
            location_info: {
                state: body.location_info.state,
                city: body.location_info.city,
                pincode: body.location_info.pincode,
                address: body.location_info.address,
            },
        });

        const authtoken = jwt.sign({ userId: user_created._id }, process.env.JWT_SECRET_KEY);

        res.status(200).json({
            success: true,
            message: `you had been signed up succesfully.`,
            authtoken,
        });
    } else {
        res.status(400).json({
            success: false,
            message: "Email had already been used !! Please Try to use another one.",
        });
    }
});

router.post("/login", async (req, res) => {
    const body = req.body;

    const user = await Users.findOne({ email: body.email });

    if (user !== null) {
        const comparison = await bcrypt.compare(body.password, user.password);

        if (comparison) {
            const authtoken = jwt.sign({ userId: user._id }, process.env.JWT_SECRET_KEY);

            res.status(200).json({
                success: true,
                message: "loged in successfully!",
                authtoken,
            });
        } else {
            res.status(400).json({
                success: false,
                message: "Incorrect Password",
            });
        }
    } else {
        res.status(404).json({
            success: false,
            message: "no user found with this email.",
        });
    }
});

// getting a user

router.get("/getuser", async (req, res) => {
    try {
        let data = null;

        try {
            data = jwt.verify(req.headers.token, process.env.JWT_SECRET_KEY);
        } catch (error) {
            res.status(404).json({
                success: false,
                message: "no user found !Invalid authtoken",
            });
        }

        try {
            const user = await Users.findById(data.userId).select("-password");

            if (user) {
                res.status(200).json({ success: true, user });
            } else {
                res.status(404).json({
                    success: false,
                    message: "no user with this id",
                });
            }
        } catch (error) {
            res.status(500).json({
                sucess: false,
                message: "some internal server error occured ! cannot fetch details",
            });
        }
    } catch (error) {
        console.log(error);
    }
});

// get all users

router.get("/getallusers", fetchUser, async (req, res) => {
    try {
        if (req.is_admin) {
            const users = await Users.find({}).select("-location_info -password -__v");
            res.status(200).json({ success: true, users });
        } else {
            res.status(401).json({
                success: false,
                message: "this route is available for admin users only",
            });
        }
    } catch (err) {
        res.status(500).json({
            success: false,
            message: "some internal server error occured",
        });
        console.log(err);
    }
});

// deleting a user

router.post("/deleteuser/:id", fetchUser, async (req, res) => {
    try {
        if (req.is_admin) {
            const userId = req.params.id;

            Users.findByIdAndDelete(userId)
                .then(() =>
                    res.status(200).json({
                        success: true,
                        message: "user deleted successfully!",
                    })
                )
                .catch((err) => {
                    console.log(err);
                    res.status(500).json({
                        success: false,
                        message: "unable to delete user ! some problem occured ....",
                    });
                });
        } else {
            res.status(401).json({
                success: false,
                message: "this route is available for admin user only !",
            });
        }
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "some internal server error occured ! unable to delete user ....",
        });
    }
});

// promote user to admin

router.post("/promoteuser/:id", fetchUser, async (req, res) => {
    try {
        if (req.is_admin) {
            const { id } = req.params;

            Users.findByIdAndUpdate(id, { is_admin: true })
                .then(() => {
                    res.status(200).json({
                        success: true,
                        message: "user promoted successfully !",
                    });
                })
                .catch((err) => {
                    console.log(err);
                    res.status(500).json({
                        success: false,
                        message: "some error occured! cannot promote user....",
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
            message: "some internal server error occured !",
        });
    }
});

// update a user
router.post("/updateuser/:id", (req, res) => {
    const { id } = req.params;

    Users.findByIdAndUpdate(id, req.body)
        .then(() => {
            res.status(200).json({
                success: true,
                message: "information updated successfully....",
            });
        })
        .catch((err) => {
            console.log(err);
            res.status(500).json({
                success: false,
                message: "some unknown error occured....",
            });
        });
});

module.exports = router;
