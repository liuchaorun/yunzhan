const android = require('../../controllers/android');

module.exports = (router) => {
    router.post('/server/android/create', android.create);
    router.get('/server/android/poll', android.poll);
};
