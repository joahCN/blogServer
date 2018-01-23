'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller, config } = app;

  const verifyLogin = app.middlewares.verifyLogin;

  // app.passport.mount('github');
  const github = app.passport.authenticate('github', {
    successRedirect: `${config.passportCallbackDomain}/`,
    loginURL: `${config.passportCallbackDomain}/passport/github`,
    callbackURL: `${config.passportCallbackDomain}/passport/github/callback`
  });
  router.get('/passport/github', github);
  router.get('/passport/github/callback', github);

  router.get('/admin', controller.home.admin);
  router.get('/login/:provider', controller.user.login);
  router.get('/user', controller.user.getUser);

  router.get('/', controller.home.index);
  router.get('/detail/:id', controller.home.detail);
  router.get('/category/:id', controller.home.index);
  
  router.get('/article/list', verifyLogin, controller.article.list);
  router.post('/article/create', verifyLogin, controller.article.create);
  router.post('/article/upload', verifyLogin, controller.article.uploadFiles);
  router.post('/article/delete', verifyLogin, controller.article.deleteArticle);
  
  router.get('/category', controller.category.getCategories);
};
