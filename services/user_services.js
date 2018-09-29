var sq = require("../models");

const UserService = function () {

    this.GetAllUsers = function () {
        return sq.user.findAll();
    };

    return this;
};

function LoadPlayer() {

}

module.exports = UserService;