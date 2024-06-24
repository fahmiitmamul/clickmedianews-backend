require("dotenv").config({
    path: ".env",
});

const express = require("express");
const cors = require("cors");
const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(cors());

app.use("/", require("./src/routers"));

const PORT = process.env.PORT;
app.listen(PORT, () => {
    console.log(`App running on port ${PORT}`);
});
