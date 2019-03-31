const NAMESPACE = require('../Namespace/index');
const screenManagement = require('../services/screen-management');

exports.getBasicInfo = async (ctx) => {
    let userId = ctx.session.userId;
    ctx.returns(await screenManagement.getBasicInfo(userId));
};

exports.getLogList = async (ctx) => {
    let userId = ctx.session.userId;
    ctx.returns(await screenManagement.getLogList(userId));
};

exports.getScreenList = async (ctx) => {
    let userId = ctx.session.userId;
    ctx.returns(await screenManagement.getScreenList(userId));
};

exports.unbindResourcePack = async (ctx) => {
    ctx.checkBody(NAMESPACE.SCREEN_MANAGEMENT.LIST.SCREEN_ID).notEmpty();
    if (ctx.returnIfParamsError()) {
        return;
    }
    let screenIds = ctx.request.body[NAMESPACE.SCREEN_MANAGEMENT.LIST.SCREEN_ID];
    let userId = ctx.session.userId;
    ctx.returns(await screenManagement.unbindResourcePack(userId, screenIds), {});
};

exports.addScreen = async (ctx) => {
    ctx.checkBody(NAMESPACE.SCREEN_MANAGEMENT.SCREEN.UUID).notEmpty();
    ctx.checkBody(NAMESPACE.SCREEN_MANAGEMENT.SCREEN.NAME).notEmpty();
    if (ctx.returnIfParamsError()) {
        return;
    }
    let userId = ctx.session.userId;
    let screenUuid = ctx.request.body[NAMESPACE.SCREEN_MANAGEMENT.SCREEN.UUID];
    let screenName = ctx.request.body[NAMESPACE.SCREEN_MANAGEMENT.SCREEN.NAME];
    ctx.returns(await screenManagement.addScreen(userId, screenUuid, screenName), {});
};

exports.deleteScreen = async (ctx) => {
    ctx.checkBody(NAMESPACE.SCREEN_MANAGEMENT.LIST.SCREEN_ID).notEmpty();
    if (ctx.returnIfParamsError()) {
        return;
    }
    let screenIds = ctx.request.body[NAMESPACE.SCREEN_MANAGEMENT.LIST.SCREEN_ID];
    let userId = ctx.session.userId;
    ctx.returns(await screenManagement.deleteScreen(userId, screenIds), {});
};

exports.startScreen = async (ctx) => {
    ctx.checkBody(NAMESPACE.SCREEN_MANAGEMENT.LIST.SCREEN_ID).notEmpty();
    if (ctx.returnIfParamsError()) {
        return;
    }
    let screenIds = ctx.request.body[NAMESPACE.SCREEN_MANAGEMENT.LIST.SCREEN_ID];
    let userId = ctx.session.userId;
    ctx.returns(await screenManagement.startScreen(userId, screenIds), {});
};

exports.stopScreen = async (ctx) => {
    ctx.checkBody(NAMESPACE.SCREEN_MANAGEMENT.LIST.SCREEN_ID).notEmpty();
    if (ctx.returnIfParamsError()) {
        return;
    }
    let screenIds = ctx.request.body[NAMESPACE.SCREEN_MANAGEMENT.LIST.SCREEN_ID];
    let userId = ctx.session.userId;
    ctx.returns(await screenManagement.stopScreen(userId, screenIds), {});
};

exports.bindResourcePack = async (ctx) => {
    ctx.checkBody(NAMESPACE.SCREEN_MANAGEMENT.LIST.SCREEN_ID).notEmpty();
    ctx.checkBody(NAMESPACE.RESOURCE_PACK_MANAGEMENT.RESOURCE_PACK.ID).notEmpty().toInt();
    if (ctx.returnIfParamsError()) {
        return;
    }
    let user = ctx.session.userId;
    let screenIds = ctx.request.body[NAMESPACE.SCREEN_MANAGEMENT.LIST.SCREEN_ID];
    let resourceId = ctx.request.body[NAMESPACE.RESOURCE_PACK_MANAGEMENT.RESOURCE_PACK.ID];
    ctx.returns(await screenManagement.bindResourcePack(user, screenIds, resourceId), {});
};

exports.changeScreenInfo = async (ctx) => {
    ctx.checkBody(NAMESPACE.SCREEN_MANAGEMENT.SCREEN.ID).notEmpty();
    ctx.checkBody(NAMESPACE.SCREEN_MANAGEMENT.SCREEN.NAME).notEmpty();
    if (ctx.returnIfParamsError()) {
        return;
    }
    let userId = ctx.session.userId;
    let screenId = ctx.request.body[NAMESPACE.SCREEN_MANAGEMENT.SCREEN.ID];
    let screenName = ctx.request.body[NAMESPACE.SCREEN_MANAGEMENT.SCREEN.NAME];
    ctx.returns(await screenManagement.changeScreenInfo(userId, screenId, screenName), {});
};
