const db = require('../db/index');
const NAMESPACE = require('../Namespace/index');
const utils = require('../libs/utils');

const { User } = db.models;

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

