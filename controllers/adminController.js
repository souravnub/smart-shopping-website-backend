const Products = require("../models/Products");
const NewsLetter = require("../models/NewsLetter");
const Orders = require("../models/Orders");
const Messages = require("../models/Messages");
const Users = require("../models/Users");
const InternalServerError = require("../errors/internal-server-error");

const getDashboardData = async (req, res, next) => {
    try {
        const mostSoldProducts = Products.find().sort({
            units_sold: -1,
        });
        const products = Products.find().select("_id name image_url price");
        const newsLetterUsers = NewsLetter.find();
        const users = Users.find().select("-password");
        const orders = Orders.find();
        const messages = Messages.find();

        Promise.all([
            mostSoldProducts,
            products,
            newsLetterUsers,
            users,
            orders,
            messages,
        ])
            .then((values) => {
                res.json({
                    success: true,
                    mostSoldProducts: values[0],
                    products: values[1],
                    newsLetterUsers: values[2],
                    users: values[3],
                    orders: values[4],
                    messages: values[5],
                });
            })
            .catch((err) => next(new InternalServerError(err.message)));
    } catch (error) {
        next(new InternalServerError(error.message));
    }
};

module.exports = { getDashboardData };
