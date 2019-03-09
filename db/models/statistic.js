module.exports = (sequelize, DataType) => {
    return sequelize.define('Statistic', {
        ip: {
            type: DataType.TEXT,
        },
    }, {
        associate: (models) => {
            let {Statistic, Screen, Tag} = models;

            Statistic.belongsToMany(Tag, {through: 'StatisticTag'});
            Tag.belongsToMany(Statistic, {through: 'StatisticTag'});

            Screen.hasOne(Statistic);
            Statistic.belongsTo(Screen);
        }
    })
};
