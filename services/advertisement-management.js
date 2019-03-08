const db = require('../db/index');
const NAMESPACE = require('../Namespace/index');
const path = require('path');
const fs = require('fs');
const config = require('../conf/config');

const { User, File } = db.models;

exports.getBasicInfo = async (id) => {
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
        [NAMESPACE.ADVERTISEMENT_MANAGEMENT.BASIC_INFO.ADVERTISEMENT_AMOUNT]: files.length,
        [NAMESPACE.ADVERTISEMENT_MANAGEMENT.BASIC_INFO.IMAGE_AMOUNT]: imagesNumber,
        [NAMESPACE.ADVERTISEMENT_MANAGEMENT.BASIC_INFO.ADVERTISEMENT_FILE_SIZE]: totalSize,
    }
};

exports.uploadVideo = async (id, file, name) => {
    let user = await User.findOne({
        where: {
            id,
        }
    });
    let userVideoPath = path.join(config.filePath.videosPath, `${user.id}`);
    if (!fs.existsSync(userVideoPath)) {
        fs.mkdirSync(userVideoPath);
    }
    let ext = path.extname(file.path);
    let destFilePath = path.join(userVideoPath, `${name}${ext}`);
    fs.copyFileSync(file.path, destFilePath);
    await File.create({
        name,
        type: 0,
        path: destFilePath,
        size: file.size,
    });
};

exports.uploadImage = async (id, file, qrCodeUrl, qrCodePosition, name) => {
    let user = await User.findOne({
        where: {
            id,
        }
    });
    let userImagePath = path.join(config.filePath.imagesPath, `${user.id}`);
    if (!fs.existsSync(userImagePath)) {
        fs.mkdirSync(userImagePath);
    }
    let ext = path.extname(file.path);
    let destFilePath = path.join(userImagePath, `${name}${ext}`);
    fs.copyFileSync(file.path, destFilePath);
    await File.create({
        name,
        type: 0,
        path: destFilePath,
        size: file.size,
        qrCodeUrl,
        qrCodePosition,
    });
};

let pathToUrl = (p) => `${config.protocol}://${config.domain}${/^\/files([\s\S]+)/.exec(p)[1]}`;

exports.getAdvertisementList = async (id) => {
    let user = await User.findOne({
        where: {
            id,
        }
    });
    let files = await user.getFiles();
    let list = [];
    for (let file of files) {
        list.push({
            [NAMESPACE.ADVERTISEMENT_MANAGEMENT.ADVERTISEMENT.ID]: file.id,
            [NAMESPACE.ADVERTISEMENT_MANAGEMENT.ADVERTISEMENT.TYPE]: file.type,
            [NAMESPACE.ADVERTISEMENT_MANAGEMENT.ADVERTISEMENT.NAME]: file.name,
            [NAMESPACE.ADVERTISEMENT_MANAGEMENT.ADVERTISEMENT.URL]: pathToUrl(file.path)
        })
    }
    return {
        [NAMESPACE.ADVERTISEMENT_MANAGEMENT.LIST.ADVERTISEMENT]: list,
    };
};

exports.getAdvertisementInfo = async (id, fileId) => {
    let user = await User.findOne({
        where: {
            id,
        }
    });
    let file = await File.findOne({
        where: {
            id: fileId,
        }
    });
    if (file === null) {
        return {
            code: 404,
            data: {},
        };
    }
    if (await user.hasFile(file)) {
        if (file.type === 0) {
            return {
                code: 200,
                data: {
                    [NAMESPACE.ADVERTISEMENT_MANAGEMENT.ADVERTISEMENT.TYPE]: file.type,
                    [NAMESPACE.ADVERTISEMENT_MANAGEMENT.ADVERTISEMENT.NAME]: file.name,
                }
            }
        } else {
            return {
                code: 200,
                data: {
                    [NAMESPACE.ADVERTISEMENT_MANAGEMENT.ADVERTISEMENT.TYPE]: file.type,
                    [NAMESPACE.ADVERTISEMENT_MANAGEMENT.ADVERTISEMENT.NAME]: file.name,
                    [NAMESPACE.ADVERTISEMENT_MANAGEMENT.IMAGE.QR_CODE_URL]: file.qrCodeUrl,
                    [NAMESPACE.ADVERTISEMENT_MANAGEMENT.IMAGE.QR_CODE_POSITION]: file.qrCodePosition,
                }
            }
        }
    } else {
        return {
            code: 403,
            data: {}
        }
    }
};


exports.updateAdvertisementInfo = async (id, fileId, name, qrCodeUrl, qrCodePosition) => {
    let user = await User.findOne({
        where: {
            id,
        }
    });
    let file = await File.findOne({
        where: {
            id: fileId,
        }
    });
    if (file === null) {
        return 404;
    }
    if (await user.hasFile(file)) {
        await file.update({
            name,
            qrCodeUrl,
            qrCodePosition,
        })
    } else {
        return 403;
    }
};
