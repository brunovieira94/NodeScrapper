module.exports = app => {
    const controller = app.controllers.notebook;

    app.route('/api/v1/notebooks')
        .get(controller.getNotebooks);

    app.route('/api/v1/saveNotebooksDB')
        .post(controller.saveNotebooksDB);

}