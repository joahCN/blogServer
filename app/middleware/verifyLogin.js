/**
 * Created by mac on 18/1/6.
 */

async function verifyLogin(ctx, next) {
    
    if(ctx.isAuthenticated()) {
        await next();    
    } else {
        // ctx.body = {
        //     success: false,
        //     message: 'please login first'
        // }
        ctx.redirect("/login");
    }
    
}

module.exports = verifyLogin;