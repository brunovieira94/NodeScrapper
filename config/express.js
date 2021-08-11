const express = require('express');
const bodyParser = require('body-parser');
const config = require('config');
const consign = require('consign');
const cors = require('cors');
const mongoose = require('mongoose')
const expressValidator = require('express-validator')
const dbconfig = require('./database')
const passport = require('passport')
const cookieParser = require('cookie-parser')
const session = require('express-session')
const User = require('../api/models/User')

module.exports = () => {
    const app = express();

    // Conexão com mongo
    mongoose.connect(dbconfig.database)
    let db = mongoose.connection
    db.once('open', ()=>{
        console.log('Connected to MongoDB')
    })
    db.on('error', (err)=>{
        console.log(err)
    })
    app.mongoose = mongoose

    // Configuração do passportJS
    require('./passport')(passport)

    // SETANDO VARIÁVEIS DA APLICAÇÃO
    app.set('port', process.env.PORT || config.get('server.port'));

    // MIDDLEWARES
    app.use(bodyParser.json())
    app.use(bodyParser.urlencoded({extended: true}))
    app.use(cors({
        origin: "http://localhost:3000",
        credentials: true
    }))
    // app.use(setUser)
    app.use(session({
        secret: "secretcode",
        resave: true,
        saveUninitialized: true
    }))
    // app.use((req, res, next) => {
    //     res.header("Access-Control-Allow-Origin", "*");
    //     res.header("Access-Control-Allow-Methods", 'GET,PUT,POST,DELETE');
    //     app.use(cors());
    //     next();
    // });
    app.use(cookieParser("secretcode"))
    
    app.use(expressValidator())
    app.use(passport.initialize())
    app.use(passport.session())

    // async function setUser(req, res, next){
    //     const userId = req.body.userId
    //     if (userId){
    //         req.user = await User.findOne({_id:userId})
    //         console.log(req.user)
    //     }
    //     next()
    // }

    // ENDPOINTS
    consign({ cwd: 'api' })
        .then('controllers')
        .then('routes')
        .into(app);

    return app;
};