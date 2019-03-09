module.exports = (sequelize, DataType) => {
    return sequelize.define('Resource', {
        name: {
            type: DataType.TEXT,
            allowNull: false,
        },
        remarks: {
            type: DataType.TEXT,
            allowNull: true,
        }
    }, {
        associate: (models) => {
            let {Resource, File, Tag} = models;

            Resource.belongsToMany(Tag, { through: 'ResourceTag' });
            Tag.belongsToMany(Resource, { through: 'ResourceTag' });

            Resource.belongsToMany(File, { through: 'ResourceFile' });
            File.belongsToMany(Resource, { through: 'ResourceFile' });
        }
    });
};
