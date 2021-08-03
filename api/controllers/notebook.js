module.exports = app => {


    const axios = require('axios');
    const cheerio = require('cheerio');
    const url = 'https://webscraper.io/test-sites/e-commerce/allinone/computers/laptops';
    const Notebook = require('../models/Notebook')
    const controller = {};

    controller.getDB = async (req, res) => {
        try {            
            const notebooks = await Notebook.find({})
            res.status(200).json(notebooks);
        } catch (error) {
            res.status(500).json(error);
        }
    }

    controller.getNotebooks = async (req, res) => {
        try {
            let response = await axios(url)
            const html = response.data;
            const $ = cheerio.load(html);
            const divNotebook = $('.thumbnail');
            const notebookTable = [];
            divNotebook.each(function () {
                const model = $(this).find('h4 > a.title').attr('title');
                const price = $(this).find('h4.pull-right.price').text();
                const description = $(this).find('.description').text();
                const reviews = $(this).find('.ratings > .pull-right').text();
                const ratings = $(this).find('.ratings p:last-child').attr('data-rating');        
                const imageURL = $(this).find('.img-responsive').attr('src');
                notebookTable.push({
                    model,
                    price,
                    description,
                    reviews,
                    ratings,
                    image: `https://webscraper.io${imageURL}`
                });
            });            
            orderedNotebookTable = notebookTable.sort((a, b) => parseFloat(a.price) - parseFloat(b.price));
            res.status(200).json(orderedNotebookTable);
        } catch (error) {
            res.status(500).json(error);
        }
    }

    controller.saveNotebooksDB = async (req, res) => {
        try {
            let response = await axios(url)
            const html = response.data;
            const $ = cheerio.load(html);
            const divNotebook = $('.thumbnail');
            const notebookTable = [];
            divNotebook.each(function () {
                const model = $(this).find('h4 > a.title').attr('title');
                const price = $(this).find('h4.pull-right.price').text();
                const description = $(this).find('.description').text();
                const reviews = $(this).find('.ratings > .pull-right').text();
                const ratings = $(this).find('.ratings p:last-child').attr('data-rating');        
                const imageURL = $(this).find('.img-responsive').attr('src');
                notebookTable.push({
                    model,
                    price,
                    description,
                    reviews,
                    ratings,
                    image: `https://webscraper.io${imageURL}`
                });
            });
            let saved = []
            for (let key in notebookTable) {
                const hasNotebook = await Notebook.find({
                    model: notebookTable[key].model,
                    description: notebookTable[key].description,
                })
                if (hasNotebook.length > 0){
                      const newValues = { $set: notebookTable[key] };
                      await Notebook.updateOne(hasNotebook, newValues);          
                }
                else {
                    await new Notebook(notebookTable[key]).save()
                }
                saved.push(notebookTable[key])
            }
            res.status(201).json(saved);
        } catch (error) {
            res.status(500).json(error);
        }
    }

    controller.getNotebook = async (req, res) => {
        try {
            let notebook = await Notebook.find({
                _id: req.params.id,
            })
            res.status(200).json(notebook);
        } catch (error) {
            res.status(500).json(error);
        }
    }

    controller.updateNotebook = async (req, res) => {
        try {
            let notebook = await Notebook.findOne({
                _id: req.params.id,
            })
            notebook.model = req.body.model || notebook.model
            notebook.price = req.body.price || notebook.price
            notebook.description = req.body.description || notebook.description 
            notebook.image = req.body.image || notebook.image
            let updated = await notebook.save()
            res.status(200).json(updated);
        } catch (error) {
            res.status(500).json(error);
        }
    }

    controller.deleteNotebook = async (req, res) => {
        try {
            let deleted = await Notebook.findOneAndRemove({
                _id: req.params.id,
            })
            res.status(200).json(deleted);
        } catch (error) {
            res.status(500).json(error);
        }
    }

    return controller;
}