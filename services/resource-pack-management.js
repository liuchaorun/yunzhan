const db = require('../db/index');
const NAMESPACE = require('../Namespace/index');
const config = require('../conf/config');
const fs = require('fs');
const path = require('path');
const utils = require('../libs/utils');

const { User, Resource, File, Tag } = db.models;

exports.getBasicInfo = async (id) => {
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
        [NAMESPACE.RESOURCE_PACK_MANAGEMENT.BASIC_INFO.RESOURCE_PACK_AMOUNT]: resources.length,
        [NAMESPACE.RESOURCE_PACK_MANAGEMENT.BASIC_INFO.USING_RESOURCE_PACK_AMOUNT]: usedNumber,
    }
};

let pathToUrl = (p) => `${config.protocol}://${config.domain}${/^\/files([\s\S]+)/.exec(p)[1]}`;

exports.submitNewResourcePack = async (id, name, adIds, tagIds) => {
    let user = await User.findOne({
        where: {
            id,
        }
    });
    let configJson = [];
    let resourceId = null;
    await db.transaction((t) => {
        return user.createResource({
            name,
        }, {transaction: t}).then((resource) => {
            let operators = [];
            resourceId = resource.id;
            if (adIds.length > 0) {
                operators = adIds.map(async (adId) => {
                    let ad = File.findOne({
                        id: adId
                    });
                    await resource.addFile(ad, {transaction: t});
                    if (ad.type === 0) {
                        configJson.push({
                            id: ad.id,
                            url: pathToUrl(ad.path),
                            type: ad.type,
                            time: 20,
                            qrCodeUrl: ad.qrCodeUrl,
                            qrCodePosition: ad.qrCodePosition
                        })
                    } else {
                        configJson.push({
                            id: ad.id,
                            url: pathToUrl(ad.path),
                            type: ad.type,
                            time: 20,
                        })
                    }
                });
            }
            if (tagIds.length > 0) {
                let tagsOperators = tagIds.map(async (tagId) => {
                    let tag = await Tag.findOne({
                        where: {
                            id: tagId,
                        }
                    });
                    await resource.addTag(tag, {transaction: t});
                });
                for (let tagOperator of tagsOperators) {
                    operators.push(tagOperator);
                }
            }
            return Promise.all(operators);
        });
    });
    fs.writeFileSync(path.join(config.filePath.jsonPath, `${resourceId}.json`), JSON.stringify(configJson));
};

exports.getResourcePackList = async (id) => {
    let user = await User.findOne({
        id,
    });
    let resources = await user.getResources();
    let data = [];
    for (let resource of resources) {
        data.push({
            [NAMESPACE.RESOURCE_PACK_MANAGEMENT.RESOURCE_PACK.ID]: resource.id,// 资源包 ID
            [NAMESPACE.RESOURCE_PACK_MANAGEMENT.RESOURCE_PACK.NAME]: resource.name,// 资源包名
            [NAMESPACE.RESOURCE_PACK_MANAGEMENT.RESOURCE_PACK.TAG_NAME]: (await resource.getTags())[0].name,// 绑定标签名（取一个就可以）
            [NAMESPACE.RESOURCE_PACK_MANAGEMENT.RESOURCE_PACK.ADVERTISEMENT_AMOUNT]: (await resource.getFiles()).length,// 内含广告数量
            [NAMESPACE.RESOURCE_PACK_MANAGEMENT.RESOURCE_PACK.SCREEN_AMOUNT]: (await resource.getScreens()).length,// 绑定屏幕数量
            [NAMESPACE.RESOURCE_PACK_MANAGEMENT.RESOURCE_PACK.DESCRIPTION]: resource.remarks// 资源包备注
        })
    }
    return {
        [NAMESPACE.RESOURCE_PACK_MANAGEMENT.LIST.RESOURCE_PACK]: data
    }
};

exports.getResourcePackTagList = async (id, resourceId) => {
    let user = await User.findOne({
        where: {
            id,
        }
    });
    let resource = await Resource.findOne({
        where: {
            id: resourceId,
        }
    });
    if (resource === null) {
        return {
            [NAMESPACE.TAG_MANAGEMENT.LIST.TAG]: []
        }
    }
    if (await user.hasResource(resource)) {
        let tags = await resource.getTags();
        let data = [];
        for (let tag of tags) {
            data.push({
                [NAMESPACE.TAG_MANAGEMENT.TAG.ID]: tag.id, // Tag 的 ID
                [NAMESPACE.TAG_MANAGEMENT.TAG.NAME]: tag.name, // Tag 的名字
                [NAMESPACE.TAG_MANAGEMENT.TAG.BINDING_RESOURCE_PACK_AMOUNT]: (await tag.getResources()).length, // Tag 当前绑定了多少个资源包
                [NAMESPACE.TAG_MANAGEMENT.TAG.CREATION_TIME]: tag.createdAt // Tag 是什么时候创建的
            })
        }
        return {
            [NAMESPACE.TAG_MANAGEMENT.LIST.TAG]: data
        }
    } else {
        return {
            [NAMESPACE.TAG_MANAGEMENT.LIST.TAG]: []
        }
    }
};

exports.getResourcePackAdvertisementList = async (id, resourceId) => {
    let user = await User.findOne({
        where: {
            id,
        }
    });
    let resource = await Resource.findOne({
        where: {
            id: resourceId,
        }
    });
    if (resource === null) {
        return {
            [NAMESPACE.RESOURCE_PACK_MANAGEMENT.LIST.ADVERTISEMENT]: []
        }
    }
    if (await user.hasResource(resource)) {
        let files = await resource.getFiles();
        let data = [];
        for (let file of files) {
            data.push({
                [NAMESPACE.ADVERTISEMENT_MANAGEMENT.ADVERTISEMENT.ID]: file.id, // 广告的 ID
                [NAMESPACE.ADVERTISEMENT_MANAGEMENT.ADVERTISEMENT.TYPE]: file.type, // 广告类型，枚举值
                [NAMESPACE.ADVERTISEMENT_MANAGEMENT.ADVERTISEMENT.NAME]: file.name, // 文件名
                [NAMESPACE.ADVERTISEMENT_MANAGEMENT.ADVERTISEMENT.URL]: pathToUrl(file.path) // 预览 URL
            })
        }
        return {
            [NAMESPACE.RESOURCE_PACK_MANAGEMENT.LIST.ADVERTISEMENT]: data
        }
    } else {
        return {
            [NAMESPACE.RESOURCE_PACK_MANAGEMENT.LIST.ADVERTISEMENT]: []
        }
    }
};

exports.getResourcePackScreenList = async (id, resourceId) => {
    let user = await User.findOne({
        where: {
            id,
        }
    });
    let resource = await Resource.findOne({
        where: {
            id: resourceId,
        }
    });
    if (resource === null) {
        return {
            [NAMESPACE.SCREEN_MANAGEMENT.LIST.SCREEN]: []
        }
    }
    if (await user.hasResource(resource)) {
        let screens = await resource.getScreens();
        let data = [];
        for (let screen of screens) {
            data.push({
                [NAMESPACE.SCREEN_MANAGEMENT.SCREEN.ID]: screen.id,
                [NAMESPACE.SCREEN_MANAGEMENT.SCREEN.UUID]: screen.uuid,
                [NAMESPACE.SCREEN_MANAGEMENT.SCREEN.NAME]: screen.name,
                [NAMESPACE.SCREEN_MANAGEMENT.SCREEN.IS_RUNNING]: utils.isOnline(screen.lastActiveTime),
                [NAMESPACE.SCREEN_MANAGEMENT.SCREEN.RESOURCE_PACK_ID]: resource.id,
                [NAMESPACE.SCREEN_MANAGEMENT.SCREEN.RESOURCE_PACK_NAME]: resource.name
            })
        }
        return {
            [NAMESPACE.SCREEN_MANAGEMENT.LIST.SCREEN]: data
        }
    } else {
        return {
            [NAMESPACE.SCREEN_MANAGEMENT.LIST.SCREEN]: []
        }
    }
};

exports.getResourcePackUnbindingTagList = async (id, resourceId) => {
    let user = await User.findOne({
        where: {
            id,
        }
    });
    let resource = await Resource.findOne({
        where: {
            id: resourceId,
        }
    });
    if (resource === null) {
        return {
            [NAMESPACE.TAG_MANAGEMENT.LIST.TAG]: []
        }
    }
    if (await user.hasResource(resource)) {
        let tags = await resource.getTags();
        let allTags = await user.getTags();
        let tagsId = [];
        for (let tag of tags) {
            tagsId.push(tag.id);
        }
        let data = [];
        for (let tag of allTags) {
            if (tagsId.indexOf(tag.id) === -1) {
                data.push({
                    [NAMESPACE.TAG_MANAGEMENT.TAG.ID]: tag.id, // Tag 的 ID
                    [NAMESPACE.TAG_MANAGEMENT.TAG.NAME]: tag.name, // Tag 的名字
                    [NAMESPACE.TAG_MANAGEMENT.TAG.BINDING_RESOURCE_PACK_AMOUNT]: (await tag.getResources()).length, // Tag 当前绑定了多少个资源包
                    [NAMESPACE.TAG_MANAGEMENT.TAG.CREATION_TIME]: tag.createdAt // Tag 是什么时候创建的
                });
            }
        }
        return {
            [NAMESPACE.TAG_MANAGEMENT.LIST.TAG]: data
        }
    } else {
        return {
            [NAMESPACE.TAG_MANAGEMENT.LIST.TAG]: []
        }
    }
};

exports.getResourcePackUnbindingAdvertisementList = async (id, resourceId) => {
    let user = await User.findOne({
        where: {
            id,
        }
    });
    let resource = await Resource.findOne({
        where: {
            id: resourceId,
        }
    });
    if (resource === null) {
        return {
            [NAMESPACE.RESOURCE_PACK_MANAGEMENT.LIST.ADVERTISEMENT]: []
        }
    }
    if (await user.hasResource(resource)) {
        let files = await resource.getFiles();
        let allFiles = await user.getFiles();
        let filesId = [];
        for (let file of files) {
            filesId.push(file.id);
        }
        let data = [];
        for (let file of allFiles) {
            if (filesId.indexOf(file.id) === -1) {
                data.push({
                    [NAMESPACE.ADVERTISEMENT_MANAGEMENT.ADVERTISEMENT.ID]: file.id, // 广告的 ID
                    [NAMESPACE.ADVERTISEMENT_MANAGEMENT.ADVERTISEMENT.TYPE]: file.type, // 广告类型，枚举值
                    [NAMESPACE.ADVERTISEMENT_MANAGEMENT.ADVERTISEMENT.NAME]: file.name, // 文件名
                    [NAMESPACE.ADVERTISEMENT_MANAGEMENT.ADVERTISEMENT.URL]: pathToUrl(file.path), // 预览 URL
                });
            }
        }
        return {
            [NAMESPACE.RESOURCE_PACK_MANAGEMENT.LIST.ADVERTISEMENT]: data
        }
    } else {
        return {
            [NAMESPACE.RESOURCE_PACK_MANAGEMENT.LIST.ADVERTISEMENT]: []
        }
    }
};

exports.changeResourcePackInfo = async (id, resourceId, name, remarks, tagIds, adIds) => {
    let user = await User.findOne({
        where: {
            id,
        }
    });
    let resource = await Resource.findOne({
        where: {
            id: resourceId,
        }
    });
    if (resource === null) {
        return 404;
    }
    if (await user.hasResource(resource)) {
        let configJson = [];
        let files = await resource.getFiles();
        let tags = await resource.getTags();
        await Promise.all(files.map(async (file) => {
            await resource.removeFile(file);
        }));
        await Promise.all(tags.map(async (tag) => {
            await resource.removeTag(tag);
        }));
        await db.transaction((t) => {
            return resource.update({
                name,
                remarks
            }, {transaction: t}).then((resource) => {
                let operators = [];
                resourceId = resource.id;
                if (adIds.length > 0) {
                    operators = adIds.map(async (adId) => {
                        let ad = File.findOne({
                            id: adId
                        });
                        await resource.addFile(ad, {transaction: t});
                        if (ad.type === 0) {
                            configJson.push({
                                id: ad.id,
                                url: pathToUrl(ad.path),
                                type: ad.type,
                                time: 20,
                                qrCodeUrl: ad.qrCodeUrl,
                                qrCodePosition: ad.qrCodePosition
                            })
                        } else {
                            configJson.push({
                                id: ad.id,
                                url: pathToUrl(ad.path),
                                type: ad.type,
                                time: 20,
                            })
                        }
                    });
                }
                if (tagIds.length > 0) {
                    let tagsOperators = tagIds.map(async (tagId) => {
                        let tag = await Tag.findOne({
                            where: {
                                id: tagId,
                            }
                        });
                        await resource.addTag(tag, {transaction: t});
                    });
                    for (let tagOperator of tagsOperators) {
                        operators.push(tagOperator);
                    }
                }
                return Promise.all(operators);
            });
        });
        fs.writeFileSync(path.join(config.filePath.jsonPath, `${resourceId}.json`), JSON.stringify(configJson));
    } else {
        return 403;
    }
};
