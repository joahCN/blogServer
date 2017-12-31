/**
 * Created by mac on 17/12/30.
 */

const Service = require('egg').Service;
const cacheManage = require('../cache/index');

class CategoryService extends Service {

    async getCategories() {
        
        const cachedData = cacheManage.getCache("getCategories");
        if(cachedData) {
            return cachedData;
        } else {
            const results = await this.app.mysql.select('category', {
                orders: [[ 'order', 'asc' ]],
            });
            cacheManage.setCache("getCategories", results);
            return results;
        }
    }

}

module.exports = CategoryService;