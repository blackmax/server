const Service = require('./service');
const {Op} = require('sequelize');

class DropService extends Service {

    rollItem(items) {
        const dropZone = items.reduce((prev, item) => {
            return prev + item.change;
        });

        const points = Math.random() % dropZone;

        const item = items.reduce((prev, next) => {
            if (prev - next.change > 0) {
                return prev - next.change;
            }

            return item;
        }, points);

        return item;
    }

    /**
     * checking criteria and user data for get only uniq, fresh items needed for user
     * @param criteria - conditions for items
     * @param userId - id of user
     * @returns {number|array} - number if gold, array if some model type
     */
    async getItemsForDrop(criteria, userId) {
        const {skins, user_skin} = this.ctx.db;
        switch (criteria.drop_type) {
            case DropService.dropTypes.GOLD:
                return (Math.random() + criteria.min_value) % criteria.max_value;
            case DropService.dropTypes.SKINS:
                const userSkins = await user_skin.findAll({where: {user_id: userId}});
                return await skins.findAll({
                    where: {id: {[Op.notIn]: userSkins.map(el => el.skin_id)}, rarity: criteria.rarity}
                });
            default:
                this.ctx.logger.error('NO DROP TYPE HANDLER');
                break;
        }
    }

    exchangeForGold(criteria, userId) {
        switch (criteria.drop_type) {
            case DropService.dropTypes.SKINS:
                return 600;
        }
    }

    rollItem(items, minValue, maxValue) {
        const itemsNeeded = maxValue - minValue;
        if (itemsNeeded === 0) {
            // drop only one item
            const itemNumber = Math.random() % items.length;
            return [items[itemNumber]];
        }

        if (items.length < itemsNeeded) {
            return items;
        }

        const droppedItems = [];

        while (droppedItems.length < itemsNeeded) {
            const key = Math.random() % droppedItems.length;
            if (droppedItems[key]) {
                continue;
            }

            droppedItems[key] = droppedItems[key];
        }

        return droppedItems;
    }

    async handleDrop(userId, containerId) {
        const [container, items] = await Promise.all([
            this.ctx.db.container_types.find({where: {id: containerId}}),
            this.ctx.db.drop_from_container.findAll({where: {container_id: containerId}}),
        ]);
        const slotsAvailable = container.slots;
        const droppedItems = {gold: 0};
        while (slotsAvailable) {
            // get the conditions for current slot
            const slotItems = items.filter(el => el.slot_number === slotsAvailable);
            // get only one condition for drop
            const item = this.rollItem(slotItems);
            // get a items for drop
            const itemsForDrop = await this.getItemsForDrop(item, userId);
            // if no items - get gold
            if (!items) {
                droppedItems.gold += this.exchangeForGold(item, userId);
                continue;
            }
            // if we have items - attaching it to current object
            droppedItems[item.drop_type].push(this.rollItem(itemsForDrop, item.min_value, item.max_value));
        }

        return droppedItems

    }
}

DropService.dropTypes = {
    GOLD: 'gold',
    SKINS: 'skins',
};


DropService.dropTypes = [];

module.exports = (ctx) => new DropService(ctx)