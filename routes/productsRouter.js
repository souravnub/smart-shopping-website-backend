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
const authorizeAdmin = require("../middlewares/authorizeAdmin");
const router = express.Router();

router.get("/getallproducts", getAllProducts);
router.get("/getproductsbycategory", getProductsByCategory);
router.post("/addproducts", authorizeAdmin, createProducts);
router.post("/updateproducts", authorizeAdmin, updateProducts);
router.post("/deleteproducts", authorizeAdmin, deleteProducts);
router.put("/addcomment/:id", addComment);
router.get("/getproducts", getProducts);

module.exports = router;
