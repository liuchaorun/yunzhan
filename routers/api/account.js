const account = require('../../controllers/account');

module.exports = (router) => {
    let prefix = (url) => `/server/account/${url}`;

    router.post(prefix('getVerificationCode'), account.getVerificationCode);
    router.post(prefix('forgetPassword'), account.forgetPassword);
    router.post(prefix('signUp'), account.signUp);
    router.post(prefix('login'), account.login);
    router.post(prefix('verifySession'), account.verifySession);
    router.post(prefix('logout'), account.logout);
};
