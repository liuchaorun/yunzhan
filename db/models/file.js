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
            allowNull: true,
        },
        qrCodePosition: {
            type: DatType.INTEGER,
            allowNull: true,
        },
        /**
         * 文件状态
         * 0未删除
         * 1删除
         */
        status: {
            type: DatType.INTEGER,
            allowNull: false,
        },
        size: DatType.INTEGER,
    }, {});
};
