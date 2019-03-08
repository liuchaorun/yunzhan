const NAMESPACE = require('../Namespace/index');
const advertisementManagement = require('../services/advertisement-management');

exports.getBasicInfo = async (ctx) => {
    let userId = ctx.session.userId;
    ctx.returns(await advertisementManagement.getBasicInfo(userId));
};

exports.uploadVideo = async (ctx) => {
    ctx.checkFile(NAMESPACE.ADVERTISEMENT_MANAGEMENT.VIDEO.FILE);
    if (ctx.returnIfParamsError()) {
        return;
    }
    let userId = ctx.session.userId;
    let file = ctx.request.body.files[NAMESPACE.ADVERTISEMENT_MANAGEMENT.VIDEO.FILE];
    let name = ctx.request.body.fields[NAMESPACE.ADVERTISEMENT_MANAGEMENT.VIDEO.NAME];
    await advertisementManagement.uploadVideo(userId, file, name);
    ctx.returns({});
};

exports.uploadImage = async (ctx) => {
    ctx.checkFile(NAMESPACE.ADVERTISEMENT_MANAGEMENT.VIDEO.FILE);
    if (ctx.returnIfParamsError()) {
        return;
    }
    let userId = ctx.session.userId;
    let file = ctx.request.body.files[NAMESPACE.ADVERTISEMENT_MANAGEMENT.VIDEO.FILE];
    let name = ctx.request.body.fields[NAMESPACE.ADVERTISEMENT_MANAGEMENT.VIDEO.NAME];
    let qrCodeUrl = ctx.request.body.fields[NAMESPACE.ADVERTISEMENT_MANAGEMENT.VIDEO.NAME];
    let qrCodePosition = ctx.request.body.fields[NAMESPACE.ADVERTISEMENT_MANAGEMENT.VIDEO.NAME];
    await advertisementManagement.uploadImage(userId, file, qrCodeUrl, qrCodePosition, name);
    ctx.returns({});
};

exports.getAdvertisementList = async (ctx) => {
    let userId = ctx.session.userId;
    ctx.returns(await advertisementManagement.getAdvertisementList(userId));
};

exports.getAdvertisementInfo = async (ctx) => {
    let userId = ctx.session.userId;
    ctx.returns(await advertisementManagement.getAdvertisementInfo(userId));
};

exports.updateAdvertisementInfo = async (ctx) => {
    ctx.checkBody(NAMESPACE.ADVERTISEMENT_MANAGEMENT.ADVERTISEMENT.ID).notEmpty().toInt();
    ctx.checkBody(NAMESPACE.ADVERTISEMENT_MANAGEMENT.ADVERTISEMENT.NAME).notEmpty();
    ctx.checkBody(NAMESPACE.ADVERTISEMENT_MANAGEMENT.IMAGE.QR_CODE_URL).notEmpty();
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
