const mongoose = require('mongoose')

const mongoURI = 'mongodb://localhost:27017/Zin'

const connectTOMongo = async() => {
    try {
        await mongoose.connect(mongoURI);
        console.log("MongoDB Connected Successfully")
    } catch (error) {
        console.log(error)
    }
}

module.exports = connectTOMongo;