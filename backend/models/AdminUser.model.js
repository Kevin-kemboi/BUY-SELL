const { Schema, model, models } = require('mongoose');

const AdminUserSchema = new Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
})

module.exports = models.AdminUsers || model("AdminUsers", AdminUserSchema);