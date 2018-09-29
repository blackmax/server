var db = require("../models/index.js");

const UserService = function () {

    this.GetAllUsers = function () {
        
        return db.users.findAll();
    };

    return this;
};

function LoadPlayer() {

}

module.exports = UserService;