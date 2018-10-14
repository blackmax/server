const client = require("config").get("client");

module.exports = ({socket, data}) => {
    // если версия совпадает - всё ок
    if (client.version === data.version) {
        return socket.emit("status", {status: 'CORRECT_VERSION'})
    }
    // низкая версия
    return socket.emit("status", {status: 'LOW_VERSION'});
};