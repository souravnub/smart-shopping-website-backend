const express = require("express");
const authorizeUser = require("../middlewares/authorizeUser");
const {
    getAllProducts,
    getProductsByCategory,
    updateProducts,
    createProducts,
    deleteProducts,
    addComment,
    getProducts,
} = require("../controllers/productsController");
const router = express.Router();

router.get("/getallproducts", getAllProducts);
router.get("/getproductsbycategory", getProductsByCategory);
router.post("/addproducts", authorizeUser, createProducts);
router.post("/updateproducts", authorizeUser, updateProducts);
router.post("/deleteproducts", authorizeUser, deleteProducts);
router.put("/addcomment/:id", addComment);
router.get("/getproducts", getProducts);

module.exports = router;
