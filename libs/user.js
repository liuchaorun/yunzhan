const Store = require('./redis');
const utils = require('./utils');

class User {
    constructor(token) {
        this.token = token;
        this.store = new Store();
    }

    async getUser() {
        return await this.store.get(this.token);
    }

    async setUser(user) {
        this.token = utils.sha256(user.id);
        await this.store.set(this.token, user, 1000 * 60 * 60 *24);
    }

    async destroy() {
        await this.store.destroy(this.token);
    }
}

