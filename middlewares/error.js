const logger = require('../libs/logger');

let requestToString = (request) => {
    const {
        url,
        query,
        body,
        headers,
    } = request;

    return `
        time: ${new Date()}
        url => ${url}
        header => ${JSON.stringify(headers)}
        query => ${JSON.stringify(query)}
        body => ${JSON.stringify(body)}
    `;
};

let errorToString = (err) => `
    msg: ${err.message}
    err: ${err}
    stack: ${err.stack}
`;

module.exports = async (ctx, next) => {
    try {
        await next();
        if (ctx.status === 404) {
            logger.info('[404]', ctx.request.url);
        }
    } catch (err) {
        console.log(err);
        ctx.status = err.status || 500;
        const errorString = `
            ${requestToString(ctx.request)}
            ${errorToString(err)}
        `;
        console.log(errorString);
        logger.error('[server-error]', errorString);
    }
};
