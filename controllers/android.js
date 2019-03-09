const android = require('../services/android');

exports.create = async (ctx) => {
    ctx.checkBody('uuid').notEmpty();
    if (ctx.returnIfParamsError()) {
        return;
    }
    let uuid = ctx.request.body.uuid;
    ctx.session.uuid = uuid;
    await android.create(uuid);
    ctx.returns({})
};

exports.poll = async (ctx) => {
    // if (!Object.prototype.hasOwnProperty.call(ctx.session, 'uuid')) {
    //     ctx.returns(404, {});
    //     return;
    // }
    // if (ctx.session.uuid === null) {
    //     ctx.returns(404, {});
    //     return;
    // }
    // let data = await android.poll(ctx.session.uuid);
    // console.log('poll: '+data);
    // ctx.returns(data.code, data.data);
    ctx.checkBody('uuid').notEmpty();
    if (ctx.errors) {
        ctx.returns(404, {});
        return;
    }
    let data = await android.poll(ctx.request.body.uuid);
    console.log(data);
    ctx.returns(data.code, data.data);
};
