const Service = require('./service');
const {Op} = require('sequelize');

class ContainerService extends Service {

    getContainers(user) {
        return this.ctx.db.containers.findOne({where: {user_id: user.id}});
    }

    async subTimeFromSlot(user, slot, seconds) {
        const userContainer = await this.getContainers(user);

        if (userContainer == null) {
            return false;
        }

        const slotsInfo = JSON.parse(userContainer.current);


        const openDate = new Date(slotsInfo[slot - 1].time);

        openDate.setSeconds(openDate.getSeconds() - seconds);

        slotsInfo[slot - 1].time = openDate.getTime();

        userContainer.current = JSON.stringify(slotsInfo);

        await userContainer.save();
    }

    async openSlot(user, slot) {
        const userContainer = await this.getContainers(user);

        if (userContainer == null) {
            return false;
        }

        const slotsInfo = JSON.parse(userContainer.current);

        const openDate = new Date(slotsInfo[slot - 1].time);

        if (openDate.getTime() > (new Date()).getTime()) {
            return false;
        }

        return this.ctx.drop_service.handleDrop(user, slotsInfo[slot - 1].container_id);
    }

    async setContainer(){
        
    }

}