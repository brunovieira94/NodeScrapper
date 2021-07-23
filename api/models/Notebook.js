let mongoose = require('mongoose')

let notebookSchema = mongoose.Schema({
    model: {type: String, required: true, unique: true},
    price: {type: String, required: true}
})

let Notebook = module.exports = mongoose.model('Notebook', notebookSchema)
