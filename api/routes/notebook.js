module.exports = app => {
    const controller = app.controllers.notebook;

    app.route('/api/v1/notebooks')
        .get(controller.getNotebooks);

}