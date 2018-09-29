var User = require("../models/user.js");

const UserService = function () {

    this.GetAllUsers = function () {
        return User.findAll();
    };

    return this;
};

function LoadPlayer() {

}

module.exports = UserService;