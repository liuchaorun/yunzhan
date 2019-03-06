const env = process.env.NODE_ENV || 'development';
const path = require('path');
const root = path.resolve(__dirname, '../');
const logDir = path.join(root, 'log');

module.exports = {
    env,
    db:{
        production: {
            name: 'postgres',
            username: 'postgres',
            pwd: '',
            host: '',
            database: '',
        },
        development: {
            name: 'postgres',
            username: 'postgres',
            pwd: 'postgres',
            host: '127.0.0.1',
            database: 'yunzhan',
        },
        toUrl() {
            const config = this[env];
            return `${config.name}://${config.username}:${config.pwd}@${config.host}/${config.database}`;
        }
    },
    redisConfig:{
        host:'127.0.0.1',
        port:'6379',
        password:'',
        toConfig() {
            if(this.password===''){
                return `redis://${this.host}:${this.port}`
            }
            else {
                return `redis://:${this.password}@${this.host}:${this.port}`;
            }
        }
    },
    sessionConfig:{
        key: 'yunzhan', /** (string) cookie key (default is koa:sess) */
        /** (number || 'session') maxAge in ms (default is 1 days) */
        /** 'session' will result in a cookie that expires when session/browser is closed */
        /** Warning: If a session cookie is stolen, this cookie will never expire */
        maxAge: 86400000,
        overwrite: true, /** (boolean) can overwrite or not (default true) */
        httpOnly: true, /** (boolean) httpOnly or not (default true) */
        signed: true, /** (boolean) signed or not (default true) */
        rolling: false, /** (boolean) Force a session identifier cookie to be set on every response. The expiration is reset to the original maxAge, resetting the expiration countdown. (default is false) */
        renew: false, /** (boolean) renew session when session is nearly expired, so we can always keep user logged in. (default is false)*/
    },
    log: {
        root: logDir,
        err: path.join(logDir, 'err.log'),
        info: path.join(logDir, 'info.log')
    },
    email: {
        service: '126',
        auth: {
            user: 'pobooks@126.com',
            pass: 'messenger126'
        }
    },
    mailOptions : {
        from: '"Messenger" <pobooks@126.com>',
        to: '',
        subject: '云展验证码',
        text: '云展注册验证码:',
    }
};
