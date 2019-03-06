const db = require('../db/index');
const NAMESPACE = require('../Namespace/index');
const utils = require('../libs/utils');

const { User } = db.models;

exports.getLoginInfo = async (id) => {
    let user = await User.findOne({
        where: {
            id,
        }
    });
    return {
        [NAMESPACE.ACCOUNT.ACCOUNT.EMAIL]: user.email,
        [NAMESPACE.OVERVIEW.LOGIN_INFO.LAST_LOGIN_IP]: user.lastLoginIp,
        [NAMESPACE.OVERVIEW.LOGIN_INFO.CURRENT_LOGIN_IP]: user.loginIp,
        [NAMESPACE.OVERVIEW.LOGIN_INFO.LAST_LOGIN_TIME]: user.lastLoginTime
    }
};

exports.getScreenInfo = async (id) => {
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
    return {
        [NAMESPACE.OVERVIEW.SCREEN_INFO.CURRENT_SCREEN_AMOUNT]: screens.length,
        [NAMESPACE.OVERVIEW.SCREEN_INFO.RUNNING_SCREEN_AMOUNT]: activeNumber,
    }
};

exports.getAdvertisementInfo = async (id) => {
    let user = await User.findOne({
        where: {
            id,
        }
    });
    let files = await user.getFiles();
    let imagesNumber = 0;
    let totalSize = 0;
    for (let file of files) {
        totalSize += file.size;
        if (file.type === 0) {
            imagesNumber ++;
        }
    }
    return {
        [NAMESPACE.OVERVIEW.ADVERTISEMENT_INFO.CURRENT_ADVERTISEMENT_AMOUNT]: files.length,
        [NAMESPACE.OVERVIEW.ADVERTISEMENT_INFO.CURRENT_IMAGE_AMOUNT]: imagesNumber,
        [NAMESPACE.OVERVIEW.ADVERTISEMENT_INFO.ADVERTISEMENT_FILE_SIZE]: totalSize,
    }
};

exports.getResourcePackInfo = async (id) => {
    let user = await User.findOne({
        where: {
            id,
        }
    });
    let resources = await user.getResources();
    let usedNumber = 0;
    await Promise.all(resources.map(async (resource) => {
        if ((await resource.getScreens()).length > 0) {
            usedNumber += 1;
        }
    }));
    return {
        [NAMESPACE.OVERVIEW.RESOURCE_PACK_INFO.CURRENT_RESOURCE_PACK_AMOUNT]: resources.length,
        [NAMESPACE.OVERVIEW.RESOURCE_PACK_INFO.CURRENT_RESOURCE_PACK_IN_USING_AMOUNT]: usedNumber,
    }
};

exports.getTagInfo = async (id) => {
    let user = await User.findOne({
        where: {
            id,
        }
    });
    return {
        [NAMESPACE.OVERVIEW.TAG_INFO.CURRENT_TAG_AMOUNT]: (await user.getTags()).length
    }
};
