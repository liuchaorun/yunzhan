const bunyan = require('bunyan');
const config = require('../conf/config');
const fs = require('fs');

if(!fs.existsSync(config.log.root)) {
    fs.mkdirSync(config.log.root);
}

const logger = bunyan.createLogger({
    name: 'bunyan',
    streams: [
        {
            level: 'info',
            path: config.log.info
        },
        {
            level: 'error',
            path: config.log.err
        }
    ]
});

module.exports = logger;
