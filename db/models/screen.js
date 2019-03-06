module.exports = (sequelize, DataType) => {
    return sequelize.define('Screen', {
        id: {
            type: DataType.UUID,
            primaryKey: true,
            defaultValue: DataType.UUIDV4,
        },
        uuid: {
            type: DataType.STRING(8),
            allowNull: false,
        },
        name: {
            type: DataType.STRING(512),
            allowNull: false,
        },
        lastActiveTime: {
            type: DataType.DATE,
            allowNull: false,
        },
    }, {
        associate: (models) => {
            let {Screen, Resource} = models;

            Screen.hasOne(Resource);
            Resource.belongsTo(Screen);
        }
    });
};
