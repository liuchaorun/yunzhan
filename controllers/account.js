const NAMESPACE = require('../Namespace/index');
const account = require('../services/account');
const returns = require('../libs/return');
const utils = require('../libs/utils');

exports.getVerificationCode = async (ctx) => {
    ctx.checkBody(NAMESPACE.ACCOUNT.ACCOUNT.EMAIL).notEmpty();
    if (ctx.returnIfParamsError()) {
        return;
    }
    let code = await account.getVerificationCode(ctx.request.body[NAMESPACE.ACCOUNT.ACCOUNT.EMAIL]);
    if (code === 0) {
        ctx.returns(returns.code.REJECT_REQUEST, {msg:'邮箱已被注册'});
    } else {
        ctx.session.code = code;
        utils.sendEmail(ctx.request.body[NAMESPACE.ACCOUNT.ACCOUNT.EMAIL], code);
        ctx.returns({});
    }
};

exports.signUp = async (ctx) => {
    ctx.checkBody(NAMESPACE.ACCOUNT.ACCOUNT.EMAIL).notEmpty();
    ctx.checkBody(NAMESPACE.ACCOUNT.ACCOUNT.PASSWORD).notEmpty();
    ctx.checkBody(NAMESPACE.ACCOUNT.VERIFICATION.VERIFICATION_CODE).notEmpty().toInt();
    if (ctx.returnIfParamsError()) {
        return;
    }
    if (Object.prototype.hasOwnProperty.call(ctx.session, 'code') && ctx.session.code === ctx.request.body[NAMESPACE.ACCOUNT.VERIFICATION.VERIFICATION_CODE]) {
        await account.signUp(ctx.request.body[NAMESPACE.ACCOUNT.ACCOUNT.EMAIL], ctx.request.body[NAMESPACE.ACCOUNT.ACCOUNT.PASSWORD], ctx.request.ip);
        ctx.returns({});
    } else {
        ctx.returns(returns.code.REJECT_REQUEST, {msg: '验证码错误'});
    }
};

exports.login = async (ctx) => {
    ctx.checkBody(NAMESPACE.ACCOUNT.ACCOUNT.EMAIL).notEmpty();
    ctx.checkBody(NAMESPACE.ACCOUNT.ACCOUNT.PASSWORD).notEmpty();
    if (ctx.returnIfParamsError()) {
        return;
    }
    let email = ctx.request.body[NAMESPACE.ACCOUNT.ACCOUNT.EMAIL];
    let password = ctx.request.body[NAMESPACE.ACCOUNT.ACCOUNT.PASSWORD];
    if (await account.checkUserExist(email) === 0) {
        ctx.returns(returns.code.NOT_FOUND, {});
    } else {
        let user = await account.login(email, password, ctx.request.ip);
        if (user === null) {
            ctx.returns(returns.code.PARAM_ERROR, {});
        } else {
            ctx.session.userId = user.id;
            ctx.returns({});
        }
    }
};

exports.verifySession = async (ctx) => {
    if (Object.prototype.hasOwnProperty.call(ctx.session, 'userId') && ctx.session.userId !== null) {
        ctx.returns({});
    } else {
        ctx.returns(returns.code.INVALID_SESSION);
    }
};

exports.logout = async (ctx) => {
    ctx.session.userId = null;
    ctx.returns({});
};

exports.forgetPassword = async (ctx) => {
    ctx.checkBody(NAMESPACE.ACCOUNT.ACCOUNT.EMAIL).notEmpty();
    ctx.checkBody(NAMESPACE.ACCOUNT.VERIFICATION.NEW_PASSWORD).notEmpty();
    ctx.checkBody(NAMESPACE.ACCOUNT.VERIFICATION.VERIFICATION_CODE).notEmpty().toInt();
    if (ctx.returnIfParamsError()) {
        return;
    }
    let id = ctx.session.userId;
    let email = ctx.request.body[NAMESPACE.ACCOUNT.ACCOUNT.EMAIL];
    let newPassword = ctx.request.body[NAMESPACE.ACCOUNT.VERIFICATION.NEW_PASSWORD];
    let code = ctx.request.body[NAMESPACE.ACCOUNT.VERIFICATION.VERIFICATION_CODE];
    if (Object.prototype.hasOwnProperty.call(ctx.session, 'code') && ctx.session.code === code) {
        if (await account.forgetPassword(id, email, newPassword)) {
            ctx.returns({});
        } else {
            ctx.returns(returns.code.NOT_FOUND, {});
        }
    } else {
        ctx.returns(returns.code.REJECT_REQUEST, {});
    }
};
