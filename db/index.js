const utils = require('../libs/utils');
const Sequelize = require('sequelize');
const config = require('../conf/config');
const db = config.db[config.env];

let sequelize = new Sequelize(
    db.database,
    db.username,
    db.password,
    {
        dialect:db.name,
        host:config.db.host,
        timezone:'+08:00'
    }
);

utils.autoImport(__dirname + '/models',function (models) {
    sequelize.import(models);
});

let models = sequelize.models;
Object.keys(models).forEach((tableName) => {
    if(models[tableName].options.hasOwnProperty('associate')){
        models[tableName].options.associate(models);
    }
});

module.exports = sequelize;
