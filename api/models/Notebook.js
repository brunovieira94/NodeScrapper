let mongoose = require('mongoose')

let notebookSchema = mongoose.Schema({
    model: {type: String, required: true},
    price: {type: String, required: true},
    description: {type: String, required: true},
    reviews: {type: String, required: true},
    ratings: {type: String, required: true},
    image: {type: String, required: true},
})

let Notebook = module.exports = mongoose.model('Notebook', notebookSchema)
