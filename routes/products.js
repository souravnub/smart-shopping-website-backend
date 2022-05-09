const express = require("express");
const fetchUser = require("../middlewares/fetchUser");
const router = express.Router();
const Products = require("../models/Products");
// getting all products

router.get("/getallproducts", async (req, res) => {
    try {
        const products = await Products.find();
        res.status(200).json({ success: true, products });
    } catch (error) {
        res.status(500).json({
            success: false,
            message:
                "some internal server error occured ... cannot fetch products",
        });
        console.log(error);
    }
});

//getting product by category

router.get("/getproductsbycategory", async (req, res) => {
    try {
        const category = req.query.category;

        if (category !== "all") {
            const products = await Products.find({ main_category: category });
            res.status(200).json({ success: true, products });
        } else {
            const products = await Products.find({});
            res.status(200).json({ success: true, products });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "some internal server error occurred...",
        });
    }
});

// adding products

router.post("/addproducts", fetchUser, async (req, res) => {
    try {
        try {
            if (req.is_admin) {
                await Products.create(req.body);

                res.status(200).json({
                    success: true,
                    message: `product add successfuly..`,
                });
            } else {
                res.status(401).json({
                    success: false,
                    message: "this route is available for admin users only",
                });
            }
        } catch (error) {
            console.log(error);
            res.status(500).json({
                success: false,
                message: "some interanl server error occured.",
                error,
            });
        }
    } catch (error) {
        console.log(error);
    }
});

// udating products

router.post("/updateproducts", fetchUser, (req, res) => {
    try {
        try {
            if (req.is_admin) {
                const new_products = req.body;

                new_products.forEach(async (product) => {
                    await Products.findByIdAndUpdate(product._id, product);
                });

                res.status(200).json({
                    success: true,
                    message: `${new_products.length} updated successfully..`,
                });
            } else {
                res.status(401).json({
                    success: false,
                    message: "route is available to admin users only..",
                });
            }
        } catch (error) {
            res.status(500).json({
                success: false,
                message: "some interanl server error occured.",
                error,
            });
        }
    } catch (error) {
        console.log(error);
    }
});

// Deleting products

router.post("/deleteproducts", fetchUser, async (req, res) => {
    try {
        try {
            if (req.is_admin) {
                const prevlength = await (await Products.find({})).length;

                const products_to_delete = req.body;

                products_to_delete.forEach(async (product_id) => {
                    await Products.findByIdAndDelete(product_id);
                });

                const deleted_quan =
                    prevlength - (await Products.find({})).length;

                res.status(200).json({
                    success: true,
                    message: `${deleted_quan} products deleted ...`,
                });
            } else {
                res.status(401).json({
                    success: false,
                    message: "route available for admin users only.",
                });
            }
        } catch (error) {
            res.status(500).json({
                success: false,
                message: "some internal error occured.",
                error,
            });
        }
    } catch (error) {
        console.log(error);
    }
});

// adding comment

router.put("/addcomment/:id", async (req, res) => {
    try {
        const comment = req.body;

        const productToChange = await Products.findById(req.params.id);

        let newComment = {
            user: comment.user,
            user_img: comment.user_img,
            user_rating: comment.rating,
            comment: comment.description,
        };

        productToChange.comments.push(newComment);

        await Products.findByIdAndUpdate(req.params.id, productToChange);

        res.status(200).json({
            success: true,
            message: "Comment Added Successfully.",
        });
    } catch (error) {
        console.log(error);
    }
});

// getting specific products

router.get("/getproducts", async (req, res) => {
    try {
        const products_obj = req.query;

        const products_arr = [];

        for (let product in products_obj) {
            const product_found = await Products.findById(
                products_obj[product]
            );
            products_arr.push(product_found);
        }

        res.json(products_arr);
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "some internal server error occured ....",
        });
    }
});

module.exports = router;
