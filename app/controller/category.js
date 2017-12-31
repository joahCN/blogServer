/**
 * Created by mac on 17/12/30.
 */
const Controller = require('egg').Controller;

class CategoryController extends Controller {

    async getCategories() {
        const categories = await this.ctx.service.category.getCategories();

        this.ctx.body = {
            categories
        }

    }

}

module.exports = CategoryController;
