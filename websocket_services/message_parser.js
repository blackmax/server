const loginCommand = require('./commands/login_command');

class MessageParser {
    constructor(message) {
        //decoding message
        this.data = this.decodeMessage(message);
    }

    decodeMessage(message) {
        return JSON.decode(message);
    }

    getAction() {
        return this.data.action;
    }

    getData() {
        return this.data.data;
    }

    async executeCommand() {
        let result = {};
        switch (this.data.action) {
            case 'login':
                result = {user: await loginCommand(this.data.data)};
                break;
            default:
                throw "NO_COMMAND_HANDLER";
                break;
        }

        return result;
    }

}