const android = require('../services/android');

exports.create = async (ctx) => {
    ctx.checkParams('uuid').notEmpty();
    if (ctx.returnIfParamsError()) {
        return;
    }
    let uuid = ctx.request.body.uuid;
    ctx.session.uuid = uuid;
    await android.create(uuid);
    ctx.returns({})
};

exports.poll = async (ctx) => {
    if (!Object.prototype.hasOwnProperty.call(ctx.session, 'uuid')) {
        ctx.returns(404, {});
        return;
    }
    if (ctx.session.uuid === null) {
        ctx.returns(404, {});
        return;
    }
    let data = await android.poll(ctx.session.uuid);
    ctx.returns(data.code, data.data);
};
