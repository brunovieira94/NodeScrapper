module.exports = app => {
    const controller = app.controllers.notebook;

    app.route('/api/v1/notebooks')
        .get(controller.getNotebooks);

    app.route('/api/v1/notebooksDB')
        .get(controller.getDB);

    app.route('/api/v1/saveNotebooksDB')
        .post(controller.saveNotebooksDB);

    app.route('/api/v1/notebook/:id')
        .get(controller.getNotebook)
        .put(controller.updateNotebook)
        .delete(controller.deleteNotebook)

}