module.exports = app => {
    const controller = app.controllers.user;

    app.route('/api/v1/register')
        .post(controller.register);

    app.route('/api/v1/login')
        .post(controller.login);

    app.route('/api/v1/user')
        .get(controller.getUser);

}