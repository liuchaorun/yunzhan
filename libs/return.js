exports.code = {
    SUCCESS: 200,
    PARAM_ERROR: 400,
    INVALID_SESSION: 401,
    REJECT_REQUEST: 403,
    NOT_FOUND: 404,
    SERVER_ERROR: 500,
};

exports.msgWrapper = (code, data) => {
    return {
        code,
        data
    }
};
