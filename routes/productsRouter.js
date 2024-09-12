const express = require("express");
const fetchUser = require("../middlewares/fetchUser");
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
router.post("/addproducts", fetchUser, createProducts);
router.post("/updateproducts", fetchUser, updateProducts);
router.post("/deleteproducts", fetchUser, deleteProducts);
router.put("/addcomment/:id", addComment);
router.get("/getproducts", getProducts);

module.exports = router;
