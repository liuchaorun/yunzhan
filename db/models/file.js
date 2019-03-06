module.exports = (sequelize, DatType) => {
    return sequelize.define('File', {
        name: {
            type: DatType.STRING(512),
            allowNull: false,
        },
        /**
         * image or video
         * 0 is image
         * 1 is video
         */
        type: {
            type: DatType.INTEGER,
            allowNull: false,
        },
        path: {
            type: DatType.TEXT,
            allowNull: false,
        },
        qrCodeUrl: {
            type: DatType.TEXT,
            allowNull: false,
        },
        qrCodePosition: {
            type: DatType.INTEGER,
            allowNull: false,
        },
        size: DatType.INTEGER,
    }, {});
};
