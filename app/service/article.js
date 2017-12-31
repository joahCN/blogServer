/**
 * Created by mac on 17/12/30.
 */

const Service = require('egg').Service;

class ArticleService extends Service {
    
    async queryArticles(options) {
        let conditions = {};
        if(options.columns) {
            conditions.colmuns = options.columns;
        }
        if(options.where) {
            conditions.where = options.where;
        }
        conditions.orders = options.orders || [[ 'time', 'desc' ]];
        const results = await this.app.mysql.select('articles', conditions);
        return results;
    }

    async queryArticle(id) {
        const article = await this.app.mysql.get('articles', {id});
        return article;
    }
}

module.exports = ArticleService;