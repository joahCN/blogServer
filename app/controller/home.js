'use strict';

const Controller = require('egg').Controller;
class HomeController extends Controller {
  async index() {
    console.log('render home page');
    const categoryId = this.ctx.params.id;

    let queryConditions = {
      columns: ['id', 'title', 'coverPage', 'type', 'subContent'],
    };

    let whereCondition = {published: 1};

    if(categoryId) {
      whereCondition.type = categoryId;
    }

    queryConditions.where = whereCondition;

    const results = await this.ctx.service.article.queryArticles(queryConditions);
    const categories = await this.ctx.service.category.getCategories();

    const articles = results.map((article)=>{
      for(let category of categories) {
        if(category.id == article.type) {
          article.typeName = category.name;
          break;
        }
      }
      return article;
    });

    this.ctx.response.type = 'html';
    await this.ctx.render('index.nj', {articles, categories, activeCategory: categoryId });
  }

  async detail() {
    console.log('render detail');
    const articleId = this.ctx.params.id;
    const article = await this.ctx.service.article.queryArticle(articleId);

    const categories = await this.ctx.service.category.getCategories();
    
    await this.ctx.render('detail.nj', {article: article || {}, categories});
  }
  
  async admin() {
    await this.ctx.render('index.html');
  }

}

module.exports = HomeController;
