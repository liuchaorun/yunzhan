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
    ctx.checkBody([NAMESPACE.SCREEN_MANAGEMENT.LIST.SCREEN_ID]).notEmpty();
    if (ctx.returnIfParamsError()) {
        return;
    }
    let screenIds = ctx.request.body[NAMESPACE.SCREEN_MANAGEMENT.LIST.SCREEN_ID];
    let userId = ctx.session.userId;
    ctx.returns(await screenManagement.unbindResourcePack(userId, screenIds), {});
};

exports.addScreen = async (ctx) => {
    ctx.checkBody([NAMESPACE.SCREEN_MANAGEMENT.SCREEN.UUID]).notEmpty();
    if (ctx.returnIfParamsError()) {
        return;
    }
    let userId = ctx.session.userId;
    let screenUuid = ctx.request.body[NAMESPACE.SCREEN_MANAGEMENT.SCREEN.UUID];
    ctx.returns(await screenManagement.addScreen(userId, screenUuid));
};

exports.deleteScreen = async (ctx) => {

};
