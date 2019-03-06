module.exports = (sequelize, DataType) => {
    return sequelize.define('ScreenLog', {
        content: DataType.TEXT,
    }, {});
};
