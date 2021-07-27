module.exports = app => {

    const User = require('../models/User')
    const Notebook = require('../models/Notebook')
    const Order = require('../models/Order')
    const controller = {};    

    controller.getOrder = async (req, res) => {  
        try{
            let order = await Order.find()
            res.status(201).json(order);
        }   
        catch(e){
            res.status(500).json(e)
        }        
    }

    controller.getOrderById = async (req, res) => {  
        try{
            let order = await Order.find({
                _id: req.params.id,
            })
            res.status(201).json(order);
        }   
        catch(e){
            res.status(500).json(e)
        }        
    }

    controller.createOrder = async (req, res) => {
        let saved = []
        try{
            saved = await new Order({
                _user: req.body.userID,
                _items: req.body.items
            }).save()
            res.status(201).json(saved);
        }   
        catch(e){
            res.status(500).json(e)
        }        
    }

    return controller;
}