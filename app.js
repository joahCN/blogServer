/**
 * Created by mac on 18/1/6.
 */
var assert = require('assert');

module.exports = app => {

    app.passport.verify(async (ctx, user) => {
        // 检查用户
        assert(user.provider, 'user.provider should exists');
        assert(user.id, 'user.id should exists');

        ctx.login(user);

        // 从数据库中查找用户信息
        //
        // Authorization Table
        // column   | desc
        // ---      | --
        // provider | provider name, like github, twitter, facebook, weibo and so on
        // uid      | provider unique id
        // user_id  | current application user id
        const authedUser = await ctx.service.user.queryAuthorizedUser({
            puid: user.id,
            provider: user.provider,
        });
        if (authedUser) {
            return authedUser;
        }
        // 调用 service 注册新用户
        const newUser = await ctx.service.user.regist(user);
        return newUser;
        
    });

    // 将用户信息序列化后存进 session 里面，一般需要精简，只保存个别字段
    app.passport.serializeUser(async (ctx, user) => {
        return user;
    });

    // 反序列化后把用户信息从 session 中取出来，反查数据库拿到完整信息
    app.passport.deserializeUser(async (ctx, user) => {
        ctx.user = user;
        return user;
    });
};