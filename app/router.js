'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller } = app;
  router.get('/', controller.home.index);
  router.get('/detail/:id', controller.home.detail);
  router.get('/category/:id', controller.home.index);
  
  router.get('/article/list', controller.article.list);
  router.post('/article/create', controller.article.create);
  router.post('/article/upload', controller.article.uploadFiles);
  router.post('/article/delete', controller.article.deleteArticle);
  
  router.get('/category', controller.category.getCategories);
};
