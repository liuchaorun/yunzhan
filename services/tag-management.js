const db = require('../db/index');
const NAMESPACE = require('../Namespace/index');

const { User, Tag } = db.models;

exports.getBasicInfo = async (id) => {
    let user = await User.findOne({
        where: {
            id,
        }
    });
    let tags = await user.getTags();
    let usedTag = 0;
    await Promise.all(tags.map(async (tag) => {
        let resources = await tag.getResources();
        if (resources.length > 0) {
            usedTag += 1;
        }
    }));
    return {
        [NAMESPACE.TAG_MANAGEMENT.BASIC_INFO.TAG_AMOUNT]: tags.length,
        [NAMESPACE.TAG_MANAGEMENT.BASIC_INFO.USING_TAG_AMOUNT]: usedTag,
    }
};

exports.submitNewTag = async (id, name) => {
    let tag = await Tag.findOne({
        where: {
            name,
        }
    });
    let user = await User.findOne({
        where: {
            id,
        }
    });
    if (tag === null) {
       await user.createTag({
           name,
       });
    } else {
        await user.addTag(tag);
    }
};

exports.getTagList = async (id) => {
    let user = await User.findOne({
        where: {
            id,
        }
    });
    let tags = await user.getTags();
    let list = [];
    await Promise.all(tags.map(async (tag, index) => {
        list[index] = {
            [NAMESPACE.TAG_MANAGEMENT.TAG.ID]: tag.id,
            [NAMESPACE.TAG_MANAGEMENT.TAG.NAME]: tag.name,
            [NAMESPACE.TAG_MANAGEMENT.TAG.BINDING_RESOURCE_PACK_AMOUNT]: (await tag.getResources()).length,
            [NAMESPACE.TAG_MANAGEMENT.TAG.CREATION_TIME]: tag.createdAt,
        };
    }));
    return {
        [NAMESPACE.TAG_MANAGEMENT.LIST.TAG]: list,
    }
};

exports.getTagInfo = async (id, tagId) => {
    let user = await User.findOne({
        where: {
            id,
        }
    });
    let tag = await Tag.findOne({
        where: {
            id: tagId
        }
    });
    if (tag === null) {
        return {
            code: 404,
            data: {}
        }
    }
    if (await user.hasTag(tag)) {
        let list = [];
        let resources = await tag.getResources();
        for (let resource of resources) {
            list.push(resource.name);
        }
        return {
            code: 200,
            data: {
                [NAMESPACE.TAG_MANAGEMENT.TAG.NAME]: tag.name,
                [NAMESPACE.TAG_MANAGEMENT.TAG.CREATION_TIME]: tag.createdAt,
                [NAMESPACE.TAG_MANAGEMENT.TAG.BINDING_RESOURCE_PACK_NAME_LIST]: list,
            }
        }
    } else {
        return {
            code: 403,
            data: {}
        }
    }
};

exports.changeTagInfo = async (id, tagId, name) => {
    let user = await User.findOne({
        where: {
            id,
        }
    });
    let tag = await Tag.findOne({
        where: {
            id: tagId,
        }
    });
    if (tag === null) {
        return 404;
    }
    if (await user.hasTag(tag)) {
        await tag.update({
            name,
        })
    } else {
        return 403;
    }
};

exports.deleteTags = async (id, tagIds) => {
    let user = await User.findOne({
        where: {
            id,
        }
    });
    let code = 200;
    await db.transaction((t) => {
        let d = tagIds.map(async (tagId) => {
            let tag = await Tag.findOne({
                where: {
                    id: tagId,
                }
            });
            if (await user.hasTag(tag)) {
                let resource = await tag.getResources();
                if (resource === null) {
                    await user.removeTag(tag, { transaction: t });
                } else {
                    code = 403;
                    throw new Error('permission denied');
                }
            } else {
                code = 403;
                throw new Error('permission denied');
            }
        });
        return Promise.all(d);
    });
    return code;
};
