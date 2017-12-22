'use strict';

const Controller = require('egg').Controller;

class ArticleController extends Controller {
  async list() {
    const results = await this.app.mysql.select('articles', {
      orders: [[ 'time', 'desc' ]],
    });
    this.ctx.body = {
      list: results,
    };
  }

  async create() {
    const ctx = this.ctx;
    const body = ctx.request.body;
    const { title, content, id } = body;
    const article = {
      title,
      content,
      time: Date.now(),
    };
    let result;
    if (id) {
      article.id = id;
      result = await this.app.mysql.update('articles', article);
    } else {
      result = await this.app.mysql.insert('articles', article);
    }
    if (result.affectedRows === 1) {
      ctx.body = {
        success: true,
      };
    } else {
      ctx.body = {
        success: false,
      };
    }
  }
}

module.exports = ArticleController;
