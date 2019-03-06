const Redis = require('ioredis');
const config = require('../conf/config');

class Store{
    constructor() {
        this.redis = new Redis(config.redisConfig.toConfig());
    }

    async get(key, maxAge){
        let data = await this.redis.get(`SESSION:${key}`);
        return JSON.parse(data);
    }

    async set(key, session, maxAge){
        await this.redis.set(`SESSION:${key}`, JSON.stringify(session), 'EX', maxAge/1000);
        return key;
    }

    async destroy(sid) {
        return await this.redis.del(`SESSION:${sid}`);
    }
}

module.exports = Store;
