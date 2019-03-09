const db = require('../db/index');
const utils = require('../libs/utils');
const Store = require('../libs/redis');
const screenRedis = new Store();

const { Screen } = db.models;

let pathToUrl = (p) => `${config.protocol}://${config.domain}${/^\/files([\s\S]+)/.exec(p)[1]}`;

exports.create = async (uuid) => {
    let screen = await Screen.findOne({
        where: {
            uuid,
        }
    });
    let data = null;
    if (screen === null) {
        screen = await Screen.create({
            uuid,
            name: uuid,
            lastActiveTime: new Date()
        });
        data = {
            bind: false,
            status: false,
            update: 0,
            url: null,
        };
        await screenRedis.set(`screen:${screen.id}`, data, 1000 * 60 * 60 * 24);
    } else {
        data = await screenRedis.get(`screen:${screen.id}`);
        let resource = await screen.getResource();
        if (data === null) {
            data = {
                bind: (await screen.getUser()) !== null,
                status: utils.isOnline(screen.lastActiveTime),
                update: screen.lastActiveTime.getTime(),
                url: pathToUrl(resource.path),
            };
            await screenRedis.set(`screen:${screen.id}`, data, 1000 * 60 * 60 * 24);
        }
    }
};

exports.poll = async (uuid) => {
    let screen = await Screen.findOne({
        where: {
            uuid,
        }
    });
    await screen.update({
        lastActiveTime: new Date(),
    })
    let data = await screenRedis.get(`screen:${screen.id}`);
    if (data === null) {
        return {
            code: 404,
            data: {}
        }
    }
    else {
        return {
            code: 200,
            data,
        }
    }
};
