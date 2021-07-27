module.exports = app => {
    const controller = app.controllers.order;


    app.route('/api/v1/getOrder')
        .get(controller.getOrder);

    app.route('/api/v1/getOrder/:id')
        .get(controller.getOrderById);

    app.route('/api/v1/createOrder')
        .post(controller.createOrder);

}