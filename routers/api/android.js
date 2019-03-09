const android = require('../../controllers/android');

module.exports = (router) => {
    router.post('/android/create', android.create);
    router.get('/android/poll', android.poll);
};
