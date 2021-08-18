module.exports = app => {

    const User = require('../models/User')
    const bcrypt = require('bcryptjs')
    const passport = require('passport')
    const controller = {};    
    const jwt = require('jsonwebtoken')

    controller.register = async (req, res) => {
        try {           
            const name = req.body.name
            const email = req.body.email
            const username = req.body.username
            const password = req.body.password
            const password2 = req.body.password2
            const profile = req.body.profile

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
                isUserRegisted = await User.findOne({username: username})
                isEmailRegisted = await User.findOne({email: email})
                if (isUserRegisted){
                    throw {message:"User Already Registered"}
                }
                else if(isEmailRegisted){
                    throw {message:"Email Already Registered"}
                }
                else {
                    let newUser = new User({
                        name:name,
                        email:email,
                        username:username,
                        password:password,
                        profile:profile
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
                                    res.status(200).send()
                                }
                            })
                        })
                    })
                }                
            }
        } catch (error) {
            res.status(500).json(error)
        }
    }

    // controller.login = async (req, res, next) => {
    //     const user = await User.findOne({username: req.body.username})
    //     if(user){
    //         const validPassword = bcrypt.compareSync(req.body.password, user.password)
    //         if(validPassword){
    //             res.status(200).send()
    //         } else {
    //             res.status(401).json({message:"Incorrect Password"})
    //         }
    //     }
    //     else {
    //         res.status(401).json({message: "User not registered"})
    //     }
    // }

    controller.login = async (req, res, next) => {
        try {
            passport.authenticate("local", (err, user, info) =>{
                if (err) throw err
                if (!user) res.status(500).json("No user exists")
                else {
                    req.logIn(user, err =>{
                        if(err) throw err
                        const token = jwt.sign({username:user.username}, 'privatekey')
                        res.send({user,token})
                    })
                }
            })(req,res,next)
        } catch (error) {
            res.status(500).json(error)
        }        
    }

    controller.getUser = async (req, res, next) => {
        try {
            res.send(req.user)
        } catch (error) {
            res.status(500).json(error)
        }        
    }

    return controller;
}