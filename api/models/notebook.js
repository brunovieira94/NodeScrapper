module.exports = app => {
    const Schema = app.mongoose.Schema({
        model: {type: String, required: true},
        price: {type: String, required: true}
    })

    const Notebook = app.mongoose.model('Notebook', Schema)

    return (Notebook)
}