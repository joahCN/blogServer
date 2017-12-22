'use strict';

const Controller = require('egg').Controller;
class HomeController extends Controller {
  async index() {
    console.log('render home page');
    this.ctx.response.type = 'html';
    await this.ctx.render('index.nj');
  }
}

module.exports = HomeController;
