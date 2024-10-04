const mongoose = require('mongoose')
require("dotenv").config();

const mongoURI = process.env.MONGODB;

const connectTOMongo = async() => {
    try {
        await mongoose.connect(mongoURI);
        console.log("MongoDB Connected Successfully")
    } catch (error) {
        console.log(error)
    }
}

module.exports = connectTOMongo;