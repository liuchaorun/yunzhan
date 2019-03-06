const Koa = require('koa');
const koaBody = require('koa-body');
const koaValidate = require('koa-validate');
const router = require('./routers/index');
const middlewares = require('./middlewares/index');
const session = require('koa-session');
const config = require('./conf/config');


const app = new Koa();

app.keys = ['im a newer secret', 'i like turtle'];
app.use(session(config.sessionConfig,app));

app.use(koaBody({
    multipart: true,
    formidable: {
        maxFileSize: 50 * 1024 * 1024
    }
}));

koaValidate(app);

middlewares.forEach((middleware) => {
    app.use(middleware);
});

app.use(router.routes());

module.exports = app;
