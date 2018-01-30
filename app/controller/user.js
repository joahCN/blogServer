/**
 * Created by mac on 17/12/30.
 */
const Controller = require('egg').Controller;

class UserController extends Controller {

    async login() {
        try {
            let provider = this.ctx.params.provider;
            this.ctx.assert(provider == "github", 500, "provider is invalid: " + provider);
            this.ctx.redirect("/passport/github");
        } catch (err) {
            this.ctx.logger.error("login error: " + err);
            this.ctx.body = {
                success: false,
                message: err.message
            }
        }
    }

    async getUser() {
        if(this.ctx.isAuthenticated()) {
            this.ctx.body = {
                userInfo: this.ctx.user,
                success: true,
                message: ''
            };
        } else {
            this.ctx.body = {
                userInfo: '',
                success: true,
                message: 'No Authorized user'
            };
        }
    }

    async logout() {
        this.ctx.logout();
        this.ctx.redirect("/");
    }

}

module.exports = UserController;
