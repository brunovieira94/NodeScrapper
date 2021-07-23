module.exports = app => {
  const controller = app.controllers.Notebook;

  app.route('/api/v1/notebooks')    
    .get(controller.getNotebooks);

}