const Products = require("../models/Products");
const cloudinaryInstance = require("..//utils/cloudinary/cloudinaryInstance");

const getAllProducts = async (req, res) => {
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
};

const getProductsByCategory = async (req, res) => {
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
};

const createProducts = async (req, res) => {
    try {
        if (req.is_admin) {
            const uploadRes = await cloudinaryInstance.uploader.upload(
                req.body.image_data_str
            );

            await Products.create({
                ...req.body,
                image_url: uploadRes.url,
                img_public_id: uploadRes.public_id,
            });

            res.status(200).json({
                success: true,
                message: `product added successfuly..`,
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
};

const updateProducts = (req, res) => {
    try {
        try {
            if (req.is_admin) {
                const new_products = req.body;

                new_products.forEach(async (product) => {
                    // TODO: handle image update if a new image is provided
                    await Products.findByIdAndUpdate(product._id, {
                        ...product,
                    });
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
            console.log("error in first catch");
            res.status(500).json({
                success: false,
                message: "some interanl server error occured.",
                error,
            });
        }
    } catch (error) {
        console.log("error in second catch");
        // console.log(error);
    }
};

const deleteProducts = async (req, res) => {
    try {
        try {
            if (req.is_admin) {
                const products = await Products.find({});
                let prevlength = products.length;

                const products_to_delete = req.body;

                products_to_delete.forEach(async (product_id) => {
                    await Products.findByIdAndDelete(product_id);
                    // TODO: delete image related to product
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
};

const addComment = async (req, res) => {
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
};

const getProducts = async (req, res) => {
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
};
module.exports = {
    getAllProducts,
    getProductsByCategory,
    getProducts,
    addComment,
    deleteProducts,
    updateProducts,
    createProducts,
};
