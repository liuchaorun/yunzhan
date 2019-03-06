module.exports = (sequelize, DataType) => {
    return sequelize.define('Tag', {
        name: {
            type: DataType.TEXT,
            allowNull: false,
        }
    }, {});
};
