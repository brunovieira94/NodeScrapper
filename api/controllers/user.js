module.exports = app => {

    const User = require('../models/User')
    const bcrypt = require('bcryptjs')
    const controller = {};    

    controller.register = async (req, res) => {
        try {           
            const name = req.body.name
            const email = req.body.email
            const username = req.body.username
            const password = req.body.password
            const password2 = req.body.password2

            req.checkBody('name', 'Name is required').notEmpty()
            req.checkBody('email', 'Email is required').notEmpty()
            req.checkBody('email', 'Email is not valid').isEmail()
            req.checkBody('username', 'Username is required').notEmpty()
            req.checkBody('password', 'Password is required').notEmpty()
            req.checkBody('password2', 'Passwords do not match').equals(req.body.password)

            let errors = req.validationErrors()

            if(errors){
                throw errors
            }
            else{
                let newUser = new User({
                    name:name,
                    email:email,
                    username:username,
                    password:password
                })

                bcrypt.genSalt(10, (err, salt)=>{
                    bcrypt.hash(newUser.password, salt, (err, hash)=>{
                        if(err){
                            throw err
                        }
                        newUser.password = hash
                        newUser.save((err)=>{
                            if(err){
                                throw err
                            } else {
                                res.status(200).json('You are now registered and can log in')
                            }
                        })
                    })
                })
            }
        } catch (error) {
            res.status(500).json(error)
        }
    }

    controller.login = async (req, res) => {
        
    }

    return controller;
}