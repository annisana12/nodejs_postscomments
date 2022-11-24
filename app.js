const express = require('express');
const app = express();
const port = 3000;

const connect = require("./schemas");
connect();

const indexRouter = require("./routes/index");

app.use(express.json());

app.use("/", [indexRouter]);

app.listen(process.env.PORT || 4000, () => {
    console.log(port, 'Server is open with port!');
})