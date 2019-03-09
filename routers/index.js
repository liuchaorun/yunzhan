const Router = require('koa-router');
const utils = require('../libs/utils');

const router = new Router();

router.get('/public/link', async (ctx) => {

    ctx.redirect(ctx.request.query.url);
});

/**
 * 引入其他路由
 */
utils.autoImport(__dirname+'/api', (tmpPath) => {   // 自动引入
    require(tmpPath)(router);
});

module.exports = router;
