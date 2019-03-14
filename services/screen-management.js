const db = require('../db/index');
const NAMESPACE = require('../Namespace/index');
const utils = require('../libs/utils');
const Store = require('../libs/redis');
const screenRedis = new Store();
const path = require('path');
const config = require('../conf/config');

const { User, Screen, Resource } = db.models;

let getScreenRedisData = async (screen, resource) => {
    let data = await screenRedis.get(`screen:${screen.id}`);
    if (data === null) {
        data = {
            bind: true,
            status: utils.isOnline(screen.lastActiveTime),
            update: 0,
            url: resource === null ? null : utils.pathToUrl(path.join(config.filePath.jsonPath, `${resource.id}.json`)),
        };
        await screenRedis.set(`screen:${screen.id}`, data, 1000 * 60 * 60 * 24)
    }
    return data;
};

exports.getBasicInfo = async (id) => {
    let user = await User.findOne({
        where: {
            id,
        }
    });
    let screens = await user.getScreens();
    let activeNumber = 0;
    for (let screen of screens) {
        if ((await getScreenRedisData(screen, (await screen.getResource()))).status && utils.isOnline(screen.lastActiveTime)) {
            activeNumber ++;
        }
    }
    let logs = await user.getScreenLogs();
    return {
        [NAMESPACE.SCREEN_MANAGEMENT.BASIC_INFO.SCREEN_AMOUNT]: screens.length,
        [NAMESPACE.SCREEN_MANAGEMENT.BASIC_INFO.RUNNING_SCREEN_AMOUNT]: activeNumber,
        [NAMESPACE.SCREEN_MANAGEMENT.BASIC_INFO.ABNORMAL_EVENT_AMOUNT]: logs.length,
    }
};

exports.getLogList = async (id) => {
    let user = await User.findOne({
        where: {
            id,
        }
    });
    let logs = await user.getScreenLogs({
        limit: 20,
        order: [['createdAt', 'DESC']]
    });
    let list = [];
    for (let log of logs) {
        list.push({
            [NAMESPACE.SCREEN_MANAGEMENT.LOG.TIME]: log.createdAt,
            [NAMESPACE.SCREEN_MANAGEMENT.LOG.CONTENT]: log.content,
        })
    }
    return {
        [NAMESPACE.SCREEN_MANAGEMENT.LIST.LOG]: list
    }
};

exports.getScreenList = async (id) => {
    let user = await User.findOne({
        where: {
            id,
        }
    });
    let screens = await user.getScreens({
        order: [['createdAt', 'DESC']]
    });
    let list = [];
    await Promise.all(screens.map(async (screen, index) => {
        let screenData = await getScreenRedisData(screen, (await screen.getResource()));
        let temp = {
            [NAMESPACE.SCREEN_MANAGEMENT.SCREEN.ID]: screen.id,
            [NAMESPACE.SCREEN_MANAGEMENT.SCREEN.UUID]: screen.uuid,
            [NAMESPACE.SCREEN_MANAGEMENT.SCREEN.NAME]: screen.name,
            [NAMESPACE.SCREEN_MANAGEMENT.SCREEN.IS_RUNNING]: screenData.status && utils.isOnline(screen.lastActiveTime)
        };
        let resource = await screen.getResource();
        if (resource !== null) {
            temp[NAMESPACE.SCREEN_MANAGEMENT.SCREEN.RESOURCE_PACK_ID] = resource.id;
            temp[NAMESPACE.SCREEN_MANAGEMENT.SCREEN.RESOURCE_PACK_NAME] = resource.name;
        }
        list[index] = temp;
    }));
    return {
        [NAMESPACE.SCREEN_MANAGEMENT.LIST.SCREEN]: list
    }
};

exports.unbindResourcePack = async (id, screenIds) => {
    let user = await User.findOne({
        where: {
            id,
        }
    });
    let returnCode = 200;
    await db.transaction((t) => {
        return Promise.all(screenIds.map(async (screenId) => {
            let screen = await Screen.findOne({
                where: {
                    id: screenId,
                }
            });
            if (screen === null) {
                returnCode = 404;
                throw new Error('screen not exists');
            }
            if (await user.hasScreen(screen)) {
                let resource = await screen.getResource();
                await screen.removeResource(resource, {transaction: t});
                let screenData = await screenRedis.get(`screen:${screenId}`);
                screenData.status = false;
                screenData.url = null;
                await screenRedis.set(`screen:${screenId}`, screenData, 1000 * 60 * 60 * 24);
            } else {
                returnCode = 403;
                throw new Error('some ');
            }
        }));
    });
    return returnCode;
};

exports.addScreen = async (id, screenUuid) => {
    let screen = await Screen.findOne({
        where: {
            uuid: screenUuid,
        }
    });
    if (screen !== null) {
        let user = await User.findOne({
            where: {
                id,
            }
        });
        await user.addScreen(screen);
        let screenData = await screenRedis.get(`screen:${screen.id}`);
        screenData.bind = true;
        await screenRedis.set(`screen:${screen.id}`, screenData, 1000 * 60 * 60 * 24);
        return 200;
    }
    return 404;
};

exports.deleteScreen = async (id, screenIds) => {
    let returnCode = 200;
    let user = await User.findOne({
        where: {
            id,
        }
    });
    await db.transaction((t) => {
        return Promise.all(screenIds.map(async (screenId) => {
            let screen = await Screen.findOne({
                where: {
                    id: screenId
                }
            });
            if (screen === null) {
                returnCode = 404;
                throw new Error('screen not exist');
            }
            if (await user.hasScreen(screen)) {
                await user.removeScreen(screen, {transaction: t});
                let screenData = await screenRedis.get(`screen:${screenId}`);
                screenData.bind = false;
                await screenRedis.set(`screen:${screenId}`, screenData, 1000 * 60 * 60 * 24);
            } else {
                returnCode = 403;
                throw new Error('user do not have this screen');
            }
        }));
    });
    return returnCode;
};

exports.startScreen = async (id, screenIds) => {
    let user = await User.findOne({
        where: {
            id,
        }
    });
    let returnCode = 200;
    let data = [];
    await Promise.all(screenIds.map(async (screenId) => {
        let screen = await Screen.findOne({
            where: {
                id: screenId,
            }
        });
        if (screen === null) {
            returnCode = 404;
        }
        if (await user.hasScreen(screen)) {
            data.push(screen.id)
        } else {
            returnCode = 403;
        }
    }));
    if (returnCode === 200) {
        for (let id of data) {
            let screen = await await Screen.findOne({
                where: {
                    id,
                }
            });
            let resource = await screen.getResource();
            let screenData = await screenRedis.get(`screen:${id}`);
            screenData.status = true;
            screenData.update = (new Date()).getTime();
            screenData.url = utils.pathToUrl(path.join(config.filePath.jsonPath, `${resource.id}.json`));
            await screenRedis.set(`screen:${id}`, screenData, 1000 * 60 * 60 * 24);
        }
    }
    return returnCode;
};

exports.stopScreen = async (id, screenIds) => {
    let user = await User.findOne({
        where: {
            id,
        }
    });
    let returnCode = 200;
    let data = [];
    await Promise.all(screenIds.map(async (screenId) => {
        let screen = await Screen.findOne({
            where: {
                id: screenId,
            }
        });
        if (screen === null) {
            returnCode = 404;
        }
        if (await user.hasScreen(screen)) {
            data.push(screen.id)
        } else {
            returnCode = 403;
        }
    }));
    if (returnCode === 200) {
        for (let id of data) {
            let screenData = await screenRedis.get(`screen:${id}`);
            screenData.status = false;
            await screenRedis.set(`screen:${id}`, screenData, 1000 * 60 * 60 * 24);
        }
    }
    return returnCode;
};

exports.bindResourcePack = async (id, screenIds, resourceId) => {
    let user = await User.findOne({
        where: {
            id,
        }
    });
    let resource = await Resource.findOne({
        where: {
            id: resourceId
        }
    });
    let returnCode = 200;
    await db.transaction((t) => {
        return Promise.all(screenIds.map(async (screenId) => {
            let screen = await Screen.findOne({
                where: {
                    id: screenId,
                }
            });
            if (screen === null) {
                returnCode = 404;
                throw new Error('screen not exist');
            }
            if (await user.hasScreen(screen)) {
                await screen.setResource(resource, {transaction: t});
                let screenData = await getScreenRedisData(screen, resource);
                screenData.update = (new Date()).getTime();
                screenData.url = utils.pathToUrl(path.join(config.filePath.jsonPath, `${resource.id}.json`));
                await screenRedis.set(`screen:${id}`, screenData, 1000 * 60 * 60 * 24);
            } else {
                returnCode = 403;
                throw new Error('user do not have this screen');
            }
        }));
    });
    return returnCode;
};
