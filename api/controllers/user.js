module.exports = app => {

    const User = require('../models/User')
    const bcrypt = require('bcryptjs')
    const passport = require('passport')
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
                                res.status(200)
                            }
                        })
                    })
                })
            }
        } catch (error) {
            res.status(500).json(error)
        }
    }

    controller.login = async (req, res, next) => {
        const user = await User.findOne({username: req.body.username})
        if(user){
            const validPassword = bcrypt.compareSync(req.body.password, user.password)
            if(validPassword){
                res.status(200)
            } else {
                res.status(401).json({message:"Incorrect Password"})
            }
        }
        else {
            res.status(401).json({message: "User not registered"})
        }
    }

    return controller;
}