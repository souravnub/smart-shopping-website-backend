const express = require("express");
const dotenv = require("dotenv");
const connectToMongo = require("./db");
const cors = require("cors");

dotenv.config();
connectToMongo();
const port =
    process.env.CURRENT_ENV === "development" ? 5000 : process.env.PORT;

const app = express();

app.use(express.json({ limit: "50mb" }));
app.use(express.json());
app.use(cors());

app.use("/api/products", require("./routes/products"));
app.use("/api/auth", require("./routes/auth"));
app.use("/messages", require("./routes/messages"));
app.use("/newsletter", require("./routes/newsletter"));
app.use("/orders", require("./routes/orders"));
app.use("/admin", require("./routes/admin"));

app.listen(port || 5000, () => {
    console.log(`listning on port http://localhost:${port}`);
});
