const Sequelize = require('sequelize');

var db = require("./db.js");

const User = db.sequelize.define('users', {
    id: {
        type: Sequelize.INTEGER(10).UNSIGNED,
        primaryKey: true,
        autoIncrement: true,
    },
    token: Sequelize.STRING(32),

},{
    timestamps: false
});

module.exports = User;
