const Service = require('./service');
const { Op } = require('sequelize');

class ContainerService extends Service {

    async getContainers(user) {
        return this.ctx.db.containers.findOne({ where: { user_id: user.id } });
    }

    async subTimeFromFristSlot(user, seconds) {
        return this.subTimeFromFristSlot(user, 0, seconds);
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

    isContainerPossibleToOpen(container){
        return (new Date()).getTime() > container.time
    }

    async dropPossibleContainers(user) {
        const uContainers = await this.getContainers(user);
        // дропать нечего
        if (uContainers == null) {
            return true;
        }

        const slots = JSON.parse(uContainers.current);

        return slots
        .filter(el => this.isContainerPossibleToOpen(el))
        .map(el => this.ctx.drop_service);
    }

}