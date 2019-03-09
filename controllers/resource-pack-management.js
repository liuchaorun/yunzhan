const NAMESPACE = require('../Namespace');
const resourcePackManagement = require('../services/resource-pack-management');

exports.getBasicInfo = async (ctx) => {
    let userId = ctx.session.userId;
    ctx.returns(await resourcePackManagement.getBasicInfo(userId));
};

exports.submitNewResourcePack = async (ctx) => {
    ctx.checkBody(NAMESPACE.RESOURCE_PACK_MANAGEMENT.RESOURCE_PACK.NAME).notEmpty();
    ctx.checkBody(NAMESPACE.RESOURCE_PACK_MANAGEMENT.LIST.ADVERTISEMENT_ID).notEmpty();
    ctx.checkBody(NAMESPACE.RESOURCE_PACK_MANAGEMENT.LIST.TAG_ID).notEmpty();
    if (ctx.returnIfParamsError()) {
        return;
    }
    let userId = ctx.session.userId;
    let name = ctx.request.body[NAMESPACE.RESOURCE_PACK_MANAGEMENT.RESOURCE_PACK.NAME];
    let fileIds = ctx.request.body[NAMESPACE.RESOURCE_PACK_MANAGEMENT.LIST.ADVERTISEMENT_ID];
    let tagIds = ctx.request.body[NAMESPACE.RESOURCE_PACK_MANAGEMENT.LIST.TAG_ID];
    await resourcePackManagement.submitNewResourcePack(userId, name, fileIds, tagIds);
    ctx.return({});
};

exports.getResourcePackList = async (ctx) => {
    let userId = ctx.session.userId;
    ctx.returns(await resourcePackManagement.getResourcePackList(userId));
};

exports.getResourcePackTagList = async (ctx) => {
    ctx.checkParams(NAMESPACE.RESOURCE_PACK_MANAGEMENT.RESOURCE_PACK.ID).notEmpty().toInt();
    if (ctx.returnIfParamsError()) {
        return;
    }
    let resourceId = ctx.params[NAMESPACE.RESOURCE_PACK_MANAGEMENT.RESOURCE_PACK.ID];
    let userId = ctx.session.userId;
    ctx.returns(await resourcePackManagement.getResourcePackTagList(userId, resourceId));
};

exports.getResourcePackAdvertisementList = async (ctx) => {
    ctx.checkParams(NAMESPACE.RESOURCE_PACK_MANAGEMENT.RESOURCE_PACK.ID).notEmpty().toInt();
    if (ctx.returnIfParamsError()) {
        return;
    }
    let resourceId = ctx.params[NAMESPACE.RESOURCE_PACK_MANAGEMENT.RESOURCE_PACK.ID];
    let userId = ctx.session.userId;
    ctx.returns(await resourcePackManagement.getResourcePackAdvertisementList(userId, resourceId));
};

exports.getResourcePackScreenList = async (ctx) => {
    ctx.checkParams(NAMESPACE.RESOURCE_PACK_MANAGEMENT.RESOURCE_PACK.ID).notEmpty().toInt();
    if (ctx.returnIfParamsError()) {
        return;
    }
    let resourceId = ctx.params[NAMESPACE.RESOURCE_PACK_MANAGEMENT.RESOURCE_PACK.ID];
    let userId = ctx.session.userId;
    ctx.returns(await resourcePackManagement.getResourcePackScreenList(userId, resourceId));
};

exports.getResourcePackUnbindingTagList = async (ctx) => {
    ctx.checkParams(NAMESPACE.RESOURCE_PACK_MANAGEMENT.RESOURCE_PACK.ID).notEmpty().toInt();
    if (ctx.returnIfParamsError()) {
        return;
    }
    let resourceId = ctx.params[NAMESPACE.RESOURCE_PACK_MANAGEMENT.RESOURCE_PACK.ID];
    let userId = ctx.session.userId;
    ctx.returns(await resourcePackManagement.getResourcePackUnbindingTagList(userId, resourceId));
};

exports.getResourcePackUnbindingAdvertisementList = async (ctx) => {
    ctx.checkParams(NAMESPACE.RESOURCE_PACK_MANAGEMENT.RESOURCE_PACK.ID).notEmpty().toInt();
    if (ctx.returnIfParamsError()) {
        return;
    }
    let resourceId = ctx.params[NAMESPACE.RESOURCE_PACK_MANAGEMENT.RESOURCE_PACK.ID];
    let userId = ctx.session.userId;
    ctx.returns(await resourcePackManagement.getResourcePackUnbindingAdvertisementList(userId, resourceId));
};

exports.changeResourcePackInfo = async (ctx) => {
    ctx.checkBody(NAMESPACE.RESOURCE_PACK_MANAGEMENT.RESOURCE_PACK.ID).notEmpty().toInt();
    ctx.checkBody(NAMESPACE.RESOURCE_PACK_MANAGEMENT.RESOURCE_PACK.NAME).notEmpty();
    ctx.checkBody(NAMESPACE.RESOURCE_PACK_MANAGEMENT.RESOURCE_PACK.DESCRIPTION).notEmpty();
    ctx.checkBody(NAMESPACE.RESOURCE_PACK_MANAGEMENT.LIST.TAG_ID).notEmpty();
    ctx.checkBody(NAMESPACE.RESOURCE_PACK_MANAGEMENT.LIST.ADVERTISEMENT_ID).notEmpty();
    if (ctx.returnIfParamsError()) {
        return;
    }
    let resourceId = ctx.request.body[NAMESPACE.RESOURCE_PACK_MANAGEMENT.RESOURCE_PACK.ID];
    let name = ctx.request.body[NAMESPACE.RESOURCE_PACK_MANAGEMENT.RESOURCE_PACK.NAME];
    let remarks = ctx.request.body[NAMESPACE.RESOURCE_PACK_MANAGEMENT.RESOURCE_PACK.DESCRIPTION];
    let tagIds = ctx.request.body[NAMESPACE.RESOURCE_PACK_MANAGEMENT.LIST.TAG_ID];
    let fileIds = ctx.request.body[NAMESPACE.RESOURCE_PACK_MANAGEMENT.LIST.ADVERTISEMENT_ID];
    let userId = ctx.session.userId;
    ctx.returns(await resourcePackManagement.changeResourcePackInfo(userId, resourceId, name, remarks, tagIds, fileIds));
};
