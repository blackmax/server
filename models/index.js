const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || 'development';
const config = require('config').get('database');

module.exports = ({logger}) => {
    var db = {};
    const sequelize = new Sequelize(config.database, config.username, config.password, {
        host: config.host,
        dialect: 'mysql',
        operatorsAliases: false,
        pool: {
            max: 5,
            min: 0,
            acquire: 30000,
            idle: 10000
        },
    });

    sequelize
        .authenticate()
        .then(() => {
            logger.info('Connection has been established successfully.')
        })
        .catch(err => {
            logger.error('Unable to connect to the database:', err);
            logger.error('Used config \n', config);
        });

    fs
        .readdirSync(__dirname)
        .filter(file => {
            return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js');
        })
        .forEach(file => {
            var model = sequelize['import'](path.join(__dirname, file));
            db[model.name] = model;
        });

    Object.keys(db).forEach(modelName => {
        if (db[modelName].associate) {
            db[modelName].associate(db);
        }
    });

    db.sequelize = sequelize;
    db.Sequelize = Sequelize;



    return db;
};
