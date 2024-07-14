const connectTOMongo = require("./db");
require('dotenv').config();
const express = require("express");
const cors = require('cors');

connectTOMongo();

const app = express();
const port = 5000;

app.use(express.json());
app.use(cors());


app.use('/admin', require('./routes/routes'));


app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
})