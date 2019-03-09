const NAMESPACE = require('../Namespace/index');
const advertisementManagement = require('../services/advertisement-management');

exports.getBasicInfo = async (ctx) => {
    let userId = ctx.session.userId;
    ctx.returns(await advertisementManagement.getBasicInfo(userId));
};

exports.uploadVideo = async (ctx) => {
    let userId = ctx.session.userId;
    let file = ctx.request.files[NAMESPACE.ADVERTISEMENT_MANAGEMENT.VIDEO.FILE];
    let name = ctx.request.body[NAMESPACE.ADVERTISEMENT_MANAGEMENT.VIDEO.NAME];
    await advertisementManagement.uploadVideo(userId, file, name);
    ctx.returns({});
};

exports.uploadImage = async (ctx) => {
    let userId = ctx.session.userId;
    let file = ctx.request.files[NAMESPACE.ADVERTISEMENT_MANAGEMENT.IMAGE.FILE];
    let name = ctx.request.body[NAMESPACE.ADVERTISEMENT_MANAGEMENT.IMAGE.NAME];
    let qrCodeUrl = ctx.request.body[NAMESPACE.ADVERTISEMENT_MANAGEMENT.IMAGE.QR_CODE_URL];
    let qrCodePosition = ctx.request.body[NAMESPACE.ADVERTISEMENT_MANAGEMENT.IMAGE.QR_CODE_POSITION];
    await advertisementManagement.uploadImage(userId, file, qrCodeUrl, qrCodePosition, name);
    ctx.returns({});
};

exports.getAdvertisementList = async (ctx) => {
    let userId = ctx.session.userId;
    ctx.returns(await advertisementManagement.getAdvertisementList(userId));
};

exports.getAdvertisementInfo = async (ctx) => {
    ctx.checkQuery(NAMESPACE.ADVERTISEMENT_MANAGEMENT.ADVERTISEMENT.ID).notEmpty().toInt();
    if (ctx.returnIfParamsError()) {
        return;
    }
    let fileId = await ctx.request.query[NAMESPACE.ADVERTISEMENT_MANAGEMENT.ADVERTISEMENT.ID];
    let userId = ctx.session.userId;
    let data = await advertisementManagement.getAdvertisementInfo(userId, fileId);
    ctx.returns(data.code, data.data);
};

exports.updateAdvertisementInfo = async (ctx) => {
    ctx.checkBody(NAMESPACE.ADVERTISEMENT_MANAGEMENT.ADVERTISEMENT.ID).notEmpty().toInt();
    ctx.checkBody(NAMESPACE.ADVERTISEMENT_MANAGEMENT.ADVERTISEMENT.NAME).notEmpty();
    ctx.checkBody(NAMESPACE.ADVERTISEMENT_MANAGEMENT.IMAGE.QR_CODE_URL);
    ctx.checkBody(NAMESPACE.ADVERTISEMENT_MANAGEMENT.IMAGE.QR_CODE_POSITION).notEmpty();
    if (ctx.returnIfParamsError()) {
        return;
    }
    let fileId = ctx.request.body[NAMESPACE.ADVERTISEMENT_MANAGEMENT.ADVERTISEMENT.ID];
    let name = ctx.request.body[NAMESPACE.ADVERTISEMENT_MANAGEMENT.ADVERTISEMENT.NAME];
    let qrCodeUrl = ctx.request.body[NAMESPACE.ADVERTISEMENT_MANAGEMENT.IMAGE.QR_CODE_URL];
    let qrCodePosition = ctx.request.body[NAMESPACE.ADVERTISEMENT_MANAGEMENT.IMAGE.QR_CODE_POSITION];
    let userId = ctx.session.userId;
    ctx.returns(await advertisementManagement.updateAdvertisementInfo(userId, fileId, name, qrCodeUrl, qrCodePosition), {});
};
