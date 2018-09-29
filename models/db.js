const Sequelize = require('sequelize');

var DB = (function () {
    this.sequelize = new Sequelize('xwt_db', 'root', '', {
        host: 'localhost',
        dialect: 'mysql',
        operatorsAliases: false,

        pool: {
            max: 5,
            min: 0,
            acquire: 30000,
            idle: 10000
        },
    });

    this.sequelize.authenticate().then(() => {
        console.log('Connection has been established successfully.');
    }).catch(err => {
        console.error('Unable to connect to the database:', err);
    });

    return this;
})();

module.exports = DB;