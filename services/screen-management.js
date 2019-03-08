const db = require('../db/index');
const NAMESPACE = require('../Namespace/index');
const utils = require('../libs/utils');
const Store = require('../libs/redis');
const screenRedis = new Store();

const { User, Screen, Resource } = db.models;

exports.getBasicInfo = async (id) => {
    let user = await User.findOne({
        where: {
            id,
        }
    });
    let screens = await user.getScreens();
    let activeNumber = 0;
    for (let screen of screens) {
        if (utils.isOnline(screen.lastActiveTime)) {
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
    let screens = await user.getScreens();
    let list = [];
    await Promise.all(screens.map(async (screen, index) => {
        let temp = {
            [NAMESPACE.SCREEN_MANAGEMENT.SCREEN.ID]: screen.id,
            [NAMESPACE.SCREEN_MANAGEMENT.SCREEN.UUID]: screen.uuid,
            [NAMESPACE.SCREEN_MANAGEMENT.SCREEN.NAME]: screen.name,
            [NAMESPACE.SCREEN_MANAGEMENT.SCREEN.IS_RUNNING]: utils.isOnline(screen.lastActiveTime)
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
            let secreen = await Screen.findOne({
                where: {
                    id: screenId,
                }
            });
            if (screen === null) {
                returnCode = 404;
                throw new Error('screen not exists');
            }
            if (await user.hasScreen(screen)) {
                let resource = await secreen.getResource();
                await resource.removeResource(resource, {transaction: t});
            } else {
                returnCode = 403;
                throw new Error('some ')
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
            await screenRedis.set(`screen:${id}`, 'start',100*60*60*24);
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
            await screenRedis.set(`screen:${id}`, 'stop',100*60*60*24);
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
                await screen.addReource(resource, {transaction: t});
            } else {
                returnCode = 403;
                throw new Error('user do not have this screen');
            }
        }));
    });
    return returnCode;
};
