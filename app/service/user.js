/**
 * Created by mac on 18/1/6.
 */
const Service = require('egg').Service;
class UserService extends Service {

    async queryAuthorizedUser({puid, provider, uid}) {

        const results = await this.app.mysql.select('user', {
            where: {puid, provider},
        });

        return results[0];
    }

    async regist(user) {
        let {provider, id, name, photo} = user;
        this.ctx.logger.info("regist new user: " + JSON.stringify(user));

        let userInfo = {
            id: Date.now(),
            provider,
            puid: id,
            name: displayName,
            image: photo,
            time: Date.now()
        };
        await this.app.mysql.insert('user', userInfo);
        
        return userInfo;
    }

}

module.exports = UserService;
