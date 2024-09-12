const express = require("express");
const dotenv = require("dotenv");
const connectToMongo = require("./db");
const cors = require("cors");

dotenv.config();
const port = 3000;

const app = express();

app.use(express.json({ limit: "50mb" }));
app.use(express.json());
app.use(cors());

app.use("/api/products", require("./routes/productsRouter"));
app.use("/api/auth", require("./routes/authRouter"));
app.use("/messages", require("./routes/messagesRouter"));
app.use("/newsletter", require("./routes/newsletterRouter"));
app.use("/orders", require("./routes/ordersRouter"));
app.use("/admin", require("./routes/adminRouter"));

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
        console.log(`listning on port: ${port}`);
    });
};
start();
