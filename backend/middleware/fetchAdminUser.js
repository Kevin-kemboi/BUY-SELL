const jwt = require('jsonwebtoken');
require('dotenv').config();
const AdminUser = require('../models/AdminUser.model')


const secret = process.env.JWT_SECRET

const fetchAdminUser = async (req, res, next) => {
    const token = req.header('Token');
    if(!token){
        return res.status(400).json({error: "invalid Token!"});
    }

    try {
        const data = jwt.verify(token, secret);
        const user = await AdminUser.findById(data.user.id).select('-password');
        if(!user){
            return res.status(400).json({error: "invalid Token!"});
        }
        req.user = user;
        next();
    } catch (error) {
        res.status(401)
    }
}

module.exports = fetchAdminUser;