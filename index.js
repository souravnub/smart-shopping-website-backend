const express = require("express");
const dotenv = require("dotenv");
const connectToMongo = require("./db");
const cors = require("cors");

const serverless = require("serverless-http");

dotenv.config();
const port = process.env.PORT || 5000;

const app = express();
const router = express.Router();

app.use(express.json({ limit: "50mb" }));
app.use(express.json());
app.use(cors());

app.use("/api/products", require("./routes/products"));
app.use("/api/auth", require("./routes/auth"));
app.use("/messages", require("./routes/messages"));
app.use("/newsletter", require("./routes/newsletter"));
app.use("/orders", require("./routes/orders"));
app.use("/admin", require("./routes/admin"));

const start = async () => {
    try {
        await connectToMongo(process.env.MONGO_URI);
    } catch (err) {
        console.log(`ERROR : while connecting to DB \nERR : ${err}`);
        return;
    }
    console.log("connected to DB....");
    app.listen(port || 5000, (err) => {
        if (err) {
            console.log(`ERROR : while listening to port \nERR : ${err}`);
            return;
        }
        console.log(`listning on port http://localhost:${port}`);
    });
};

app.use("/.netlify/functions/api", router);
start();

module.exports.handler = serverless(app);
