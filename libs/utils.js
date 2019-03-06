const fs = require('fs');
const path = require('path');
const nodemailer = require('nodemailer');
const config = require('../conf/config');

exports.autoImport = (nextPath,callback) => {
    let isDir = fs.statSync(nextPath).isDirectory();
    if(isDir){
        fs
            .readdirSync(nextPath)
            .filter((file) => {
                return file !== "index.js" && file !== "migrate.js" && file.indexOf(".") !== 0;
            }).forEach((fileName) => {
            let tmpPath = path.join(nextPath,fileName);
            if(fs.statSync(tmpPath).isDirectory()){
                autoImport(tmpPath,callback);
            }else{
                callback(tmpPath);
            }
        });
    }
};

exports.sendEmail = (email, code) => {
    return new Promise((resolve, reject) => {
        let mailOptions = config.mailOptions;
        mailOptions.text += code;
        mailOptions.to = email;
        nodemailer.createTransport(config.email).sendMail(mailOptions, (error, info) => {
            if (error) {
                reject(error);
            }
            resolve('Message %s sent: %s', info.messageId, info.response);
        });
    })
};

exports.generateCode = () => Math.floor(Math.random() * 9000 + 1000);

exports.isOnline = (last) => {
    let now = (new Date()).getTime();
    return (now - last.getTime()) <= 1000 * 60 * 5;
};
