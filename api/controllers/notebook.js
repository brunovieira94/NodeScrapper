module.exports = app => {

    
    const axios = require('axios');
    const cheerio = require('cheerio');
    const url = 'https://webscraper.io/test-sites/e-commerce/allinone/computers/laptops';
    const controller = {};

    controller.getNotebooks = async (req, res) => {
        const Notebook = require('../models/Notebook')
        try {
            let response = await axios(url)
            const html = response.data;
            const $ = cheerio.load(html);
            const divNotebook = $('.caption');
            const notebookTable = [];
            divNotebook.each(function () {
                const model = $(this).find('h4 > a.title').text();
                const price = $(this).find('h4.pull-right.price').text();
                notebookTable.push({
                    model,
                    price
                });
            });
            orderedNotebookTable = notebookTable.sort((a, b) => parseFloat(a.price) - parseFloat(b.price));
            res.status(200).json(orderedNotebookTable);
        } catch (error) {
            res.status(500).json("erro");
        }
    }


    controller.saveNotebooksDB = async (req, res) => {
        const Notebook = require('../models/Notebook')
        try {
            let response = await axios(url)
            const html = response.data;
            const $ = cheerio.load(html);
            const divNotebook = $('.caption');
            const notebookTable = [];
            divNotebook.each(function () {
                const model = $(this).find('h4 > a.title').text();
                const price = $(this).find('h4.pull-right.price').text();
                notebookTable.push({
                    model,
                    price
                });
            });
            let saved = []
            for(let key in notebookTable){
                saved.push(await new Notebook(notebookTable[key]).save())
            }
            res.status(200).json(saved);
        } catch (error) {
            res.status(500).json("erro");
        }
    }

    return controller;
}