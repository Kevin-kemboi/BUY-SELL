const mongoose = require('mongoose')
require("dotenv").config();

const mongoURI = process.env.MONGODB;

const connectTOMongo = async () => {
    if (process.env.SKIP_DB === '1') {
        console.log('[db] SKIP_DB=1 set — skipping Mongo connection (mock mode)');
        return;
    }
    try {
        await mongoose.connect(mongoURI);
        console.log('MongoDB Connected Successfully');
    } catch (error) {
        console.log('[db] Connection error:', error.message);
    }
};

module.exports = connectTOMongo;