const returns = require('../libs/return');

module.exports = async (ctx, next) => {
    ctx.returnParamsError = (err) => {
        ctx.body = returns.msgWrapper(returns.code.PARAM_ERROR, err || ctx.errors);
    };

    ctx.returnIfParamsError = () => {
        if (ctx.errors) {
            ctx.returnParamsError();
            return true;
        }
        return false;
    };


    ctx.returns = (...args) => {
        let [code, data] = [returns.code.SUCCESS, null];
        if (args.length === 1) {
            [data] = args;
        } else if (args.length === 2) {
            [code, data] = args;
        }
        ctx.body = returns.msgWrapper(code, data);
    };

    if (/^\/server\//.test(ctx.request.url)) {
        if (/^\/server\/admin\//.test(ctx.request.url)) {
            if (!(Object.prototype.hasOwnProperty.call(ctx.session, 'userId') && ctx.session.userId !== null)) {
                ctx.returns(returns.code.INVALID_SESSION, {});
                ctx.returns = null;
                ctx.returnIfParamsError = null;
                ctx.returnParamsError = null;
                return;
            }
        }
    }

    await next();

    ctx.returns = null;
    ctx.returnIfParamsError = null;
    ctx.returnParamsError = null;
};
