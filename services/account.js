const db = require('../db/index');

const {User} = db.models;

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
    return await user.update({
        loginIp: ip,
        loginTime: new Date(),
        lastLoginIp,
        lastLoginTime,
    });
};


exports.forgetPassword = async (id, email, newPassword) => {
    let user = await User.findOne({
        where: {
            email,
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
