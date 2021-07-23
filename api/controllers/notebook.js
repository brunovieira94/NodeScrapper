module.exports = app => {

    const controller = {};

    controller.getNotebooks = (req, res) => {
        const axios = require('axios');
        const cheerio = require('cheerio');
        const url = 'https://webscraper.io/test-sites/e-commerce/allinone/computers/laptops';
        axios(url).then(response => {
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
        }).catch(res.status(500));
    };
    return controller;
}