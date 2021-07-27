const mongoose = require('mongoose')

let OrderSchema = mongoose.Schema({
    _user: {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true},
    _items: [{
        _id: false,
        item: {type: mongoose.Schema.Types.ObjectId, ref: 'Notebook', required: true},
        quantity : {type: Number, default: 0, required: true}
    }],
})

let Order = module.exports = mongoose.model('Order', OrderSchema)