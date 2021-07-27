const express = require('express');
const bodyParser = require('body-parser');
const config = require('config');
const consign = require('consign');
const cors = require('cors');
const mongoose = require('mongoose')
const expressValidator = require('express-validator')

module.exports = () => {
    const app = express();

    mongoose.connect('mongodb://localhost/scrapperNode')
    let db = mongoose.connection
    db.once('open', ()=>{
        console.log('Connected to MongoDB')
    })
    db.on('error', (err)=>{
        console.log(err)
    })
    app.mongoose = mongoose

    // SETANDO VARIÁVEIS DA APLICAÇÃO
    app.set('port', process.env.PORT || config.get('server.port'));

    // MIDDLEWARES
    app.use(bodyParser.json());
    app.use((req, res, next) => {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Methods", 'GET,PUT,POST,DELETE');
        app.use(cors());
        next();

    });
    app.use(expressValidator())

    // ENDPOINTS
    consign({ cwd: 'api' })
        .then('controllers')
        .then('routes')
        .into(app);

    return app;
};