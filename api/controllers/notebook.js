module.exports = app => {


    const axios = require('axios');
    const cheerio = require('cheerio');
    const url = 'https://webscraper.io/test-sites/e-commerce/allinone/computers/laptops';
    const Notebook = require('../models/Notebook')
    const controller = {};

    controller.getNotebooks = async (req, res) => {
        try {
            let response = await axios(url)
            const html = response.data;
            const $ = cheerio.load(html);
            const divNotebook = $('.caption');
            const notebookTable = [];
            divNotebook.each(function () {
                const model = $(this).find('h4 > a.title').attr('title');
                const price = $(this).find('h4.pull-right.price').text();
                const description = $(this).find('.description').text();
                notebookTable.push({
                    model,
                    price,
                    description
                });
            });            
            orderedNotebookTable = notebookTable.sort((a, b) => parseFloat(a.price) - parseFloat(b.price));
            res.status(200).json(orderedNotebookTable);
        } catch (error) {
            res.status(500).json("erro");
        }
    }


    controller.saveNotebooksDB = async (req, res) => {
        try {
            let response = await axios(url)
            const html = response.data;
            const $ = cheerio.load(html);
            const divNotebook = $('.caption');
            const notebookTable = [];
            divNotebook.each(function () {
                const model = $(this).find('h4 > a.title').attr('title');
                const price = $(this).find('h4.pull-right.price').text();
                const description = $(this).find('.description').text();
                notebookTable.push({
                    model,
                    price,
                    description
                });
            });
            let saved = []
            for (let key in notebookTable) {
                // let notebook = new Notebook()
                // notebook.model = notebookTable[key].model
                // notebook.price = notebookTable[key].price 
                // notebook.description = notebookTable[key].description 
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

    return controller;
}