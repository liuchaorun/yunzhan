const utils = require('../libs/utils');
const db = require('../db/index');

const {User} = db.models;

exports.getVerificationCode = async (email) => {
    let isExist = await User.count({
        where: {
            email,
        }
    });
    if (isExist === 1) {
        return 0;
    }
    return utils.generateCode();
};

exports.signUp = async (email, password, ip) => {
    await User.create({
        email,
        password,
        loginTime: new Date(),
        loginIp: ip
    });
};

exports.checkUserExist = async (email) => {
    return await User.count({
        where: {
            email,
        }
    })
};

exports.login = async (email, password, ip) => {
    let user = await User.findOne({
        where: {
            email,
            password,
        }
    });
    let lastLoginIp = user.loginIp;
    let lastLoginTime = user.loginTime;
    await user.update({
        loginIp: ip,
        loginTime: new Date(),
        lastLoginIp,
        lastLoginTime,
    });
};


exports.forgetPassword = async (id, email, newPassword) => {
    let user = await User.findOne({
        where: {
            id,
        }
    });
    if (user.email === email) {
        await user.update({
            password: newPassword,
        });
        return true;
    }
    return false;
};
