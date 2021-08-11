const mongoose = require('mongoose')

let UserSchema = mongoose.Schema({
    name: {type: String, required: true},
    email: {type: String, required: true},
    username: {type: String, required: true},
    password: {type: String, required: true},
    profile: {type: String, enum: ["user", "admin"], default: "user"}
})

let User = module.exports = mongoose.model('User', UserSchema)