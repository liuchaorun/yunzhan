const overview = require('../services/overview');

exports.getLoginInfo = async (ctx) => {
    let userId = ctx.session.userId;
    ctx.returns(await overview.getLoginInfo(userId));
};

exports.getScreenInfo = async (ctx) => {
    let userId = ctx.session.userId;
    ctx.returns(await overview.getScreenInfo(userId));
};

exports.getAdvertisementInfo = async (ctx) => {
    let userId = ctx.session.userId;
    ctx.returns(await overview.getAdvertisementInfo(userId));
};

exports.getResourcePackInfo = async (ctx) => {
    let userId = ctx.session.userId;
    ctx.returns(await overview.getResourcePackInfo(userId));
};

exports.getTagInfo = async (ctx) => {
    let userId = ctx.session.userId;
    ctx.returns(await overview.getTagInfo(userId));
};
