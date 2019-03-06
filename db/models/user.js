module.exports = (sequelize, DataType) => {
    return sequelize.define('User', {
        id: {
            type: DataType.UUID,
            primaryKey: true,
            defaultValue: DataType.UUIDV4,
        },
        email: {
            type: DataType.STRING(512),
            allowNull: false,
        },
        password: {
            type: DataType.STRING(64),
            allowNull: false,
        },
        loginTime: DataType.DATE,
        loginIp: DataType.STRING,
        lastLoginTime: DataType.DATE,
        lastLoginIp: DataType.STRING,
    }, {
        associate: (models) => {
            let {User, File, Tag, Screen, Resource, ScreenLog} = models;

            User.hasMany(File);
            File.belongsTo(User);

            User.belongsToMany(Tag, { through: 'UserTag' });
            Tag.belongsToMany(User, { through: 'UserTag' });

            User.hasMany(Screen);
            Screen.belongsTo(User);

            User.hasMany(Resource);
            Resource.belongsTo(User);

            User.hasMany(ScreenLog);
            ScreenLog.belongsTo(User);
        }
    });
};
