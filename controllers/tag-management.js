const NAMESPACE = require('../Namespace');
const tagManagement = require('../services/tag-management');

exports.getBasicInfo = async (ctx) => {
    let userId = ctx.session.userId;
    ctx.returns(await tagManagement.getBasicInfo(userId));
};

exports.submitNewTag = async (ctx) => {
    ctx.checkBody(NAMESPACE.TAG_MANAGEMENT.TAG.NAME).notEmpty();
    if (ctx.returnIfParamsError()) {
        return;
    }
    let name = ctx.request.body[NAMESPACE.TAG_MANAGEMENT.TAG.NAME];
    let userId = ctx.session.userId;
    await tagManagement.submitNewTag(userId, name);
    ctx.returns({});
};

exports.getTagList = async (ctx) => {
    let userId = ctx.session.userId;
    ctx.returns(await tagManagement.getTagList(userId));
};

exports.getTagInfo = async (ctx) => {
    ctx.checkQuery(NAMESPACE.TAG_MANAGEMENT.TAG.ID).notEmpty().toInt();
    if (ctx.returnIfParamsError()) {
        return;
    }
    let tagId = ctx.request.query[NAMESPACE.TAG_MANAGEMENT.TAG.ID];
    let userId = ctx.session.userId;
    let data = await tagManagement.getTagInfo(userId, tagId);
    ctx.returns(data.code, data.data);
};

exports.changeTagInfo = async (ctx) => {
    ctx.checkBody(NAMESPACE.TAG_MANAGEMENT.TAG.ID).notEmpty().toInt();
    ctx.checkBody(NAMESPACE.TAG_MANAGEMENT.TAG.NAME).notEmpty();
    if (ctx.returnIfParamsError()) {
        return;
    }
    let tagId = ctx.request.body[NAMESPACE.TAG_MANAGEMENT.TAG.ID];
    let name = ctx.request.body[NAMESPACE.TAG_MANAGEMENT.TAG.NAME];
    let userId = ctx.session.userId;
    ctx.returns(await tagManagement.changeTagInfo(userId, tagId, name));
};
