const Service = require('./service');
const {Op} = require('sequelize');

class DropService extends Service {
    /**
     * rolling random int between demensions
     * @param min
     * @param max
     * @returns {number}
     */
    randomInteger(min, max) {
        let rand = min + Math.random() * (max + 1 - min);
        rand = Math.floor(rand);
        return rand;
    }

    /**
     * roll type of items which will be roled
     * @param criterias
     * @returns {*}
     */
    rollType(criterias) {
        const dropZone = Object.keys(criterias).reduce((prev, item) => {
            return prev + item.change;
        });

        const points = this.randomInteger(1, dropZone);

        return criterias.reduce((prev, item) => {

            if (prev - item.chance > 0)
                return prev - item.chance;

            return item;
        }, points);
    }

    /**
     * rolling items from given data
     * @param items - where will be roll
     * @param type - type of items
     * @param minValue - minimal count
     * @param maxValue - maximal count
     * @param rarity - rarity of dropped item
     * @returns {*}
     */
    rollItem(items, type, minValue, maxValue, rarity) {
        switch (type) {
            case DropService.dropTypes.MONEY:
                return items;
            case DropService.dropTypes.GOLD:
                return items;
            default:
                const itemsNeeded = maxValue - minValue;
                if (itemsNeeded === 0) {
                    // drop only one item
                    const itemNumber = Math.random() % items.length;
                    return [items[itemNumber]];
                }

                if (items.length < itemsNeeded) {
                    return items;
                }

                const droppedItems = {};

                while (Object.keys(droppedItems).length < itemsNeeded) {
                    const key = this.randomInteger(0, items.length);
                    if (droppedItems[key]) {
                        continue;
                    }
                    droppedItems[key] = items[key];
                }

                return droppedItems;
        }
    }

    /**
     * checking criteria and user data for get only uniq, fresh items needed for user
     * @param criteria - conditions for items
     * @param userId - id of user
     * @returns {number|array} - number if gold, array if some model type
     */
    async getItemsForDrop(criteria, userId) {
        const {skins, user_skin, user_parts, user_cars, parts, cars} = this.ctx.db;
        switch (criteria.drop_type) {
            case DropService.dropTypes.MONEY:
                return this.randomInteger(criteria.min_value, criteria.max_value);
            case DropService.dropTypes.GOLD:
                return this.randomInteger(criteria.min_value, criteria.max_value);
            case DropService.dropTypes.SKINS:
                const userSkins = await user_skin.findAll({where: {user_id: userId}});
                if (!userSkins) {
                    return await skins.findAll({where: {rarity: criteria.rarity}});
                }
                return await skins.findAll({
                    where: {id: {[Op.notIn]: userSkins.map(el => el.skin_id)}, rarity: criteria.rarity}
                });
            case DropService.dropTypes.PARTS:
                const userCars = await user_cars.findAll({where: {user_id: userId}});
                const existingCars = await cars.findAll({
                    where: {
                        id: {
                            [Op.in]: userCars.map(element => element.car_id)
                        }
                    }
                });
                const userParts = await user_parts.findAll({where: {user_id: userId}});
                return await parts.findAll({
                    where: {
                        id: {
                            [Op.notIn]: userParts.map(element => element.part_id)
                        },
                        class: {
                            [Op.in]: [existingCars.map(el => el.class)],
                        },
                        rarity: criteria.rarity,
                    }
                });

            default:
                this.ctx.logger.error(`NO DROP TYPE HANDLER ${criteria.drop_type.toUpperCase()}`);
                break;
        }
    }

    /**
     * exchange item for gold
     * @param criteria
     * @param userId
     * @returns {number}
     */
    exchangeForMoney(criteria, userId) {
        return 1;
    }

    async handleDrop(user, containerId) {
        const [container, items] = await Promise.all([
            this.ctx.db.containers_types.find({where: {id: containerId}}),
            this.ctx.db.drop_from_container.findAll({where: {container_id: containerId}}),
        ]);
        let slotsAvailable = container.slots + 1;
        let droppedItems = {slots: {}};
        while (slotsAvailable--) {
            // get the conditions for current slot
            const slotItems = items.filter(item => item.slot_number === slotsAvailable);

            if (slotItems.length === 0) {
                continue;
            }
            // get only one condition for drop
            const item = this.rollType(slotItems);
            // get a items for drop
            const itemsForDrop = await this.getItemsForDrop(item, user.id);
            // if no items - get gold
            if (!itemsForDrop) {
                droppedItems.slots[slotsAvailable] = {
                    [item.drop_type]: {
                        exchanged: true,
                        exchanged_type: 'money',
                        money: this.exchangeForMoney(item, user.id)
                    }
                };
                continue;
            }
            // if we have items - attaching it to current object
            droppedItems.slots[slotsAvailable] = {[item.drop_type]: this.rollItem(itemsForDrop, item.drop_type, item.min_value, item.max_value, item.rarity)};

            this.ctx.logger.debug('dropped items', droppedItems);
        }

        return droppedItems
    }

    isDropExchanged(item) {
        return item.exchanged;
    }

    attachDropToUser(user, drop) {
        Object.keys(drop).forEach(key => {
            const slotDrop = drop[key];
            Object.keys(slotDrop).forEach(slotDropKey => {
                const value = slotDrop[slotDropKey];
                if (this.isDropExchanged(value)) {

                }
                switch (slotDropKey) {
                    case DropService.dropTypes.GOLD:
                        user.gold += value;
                        break;
                    case DropService.dropTypes.MONEY:
                        user.money += value;
                        break;
                }
            })
        });
    }
}

DropService.dropTypes = {
    GOLD: 'gold',
    MONEY: 'money',
    SKINS: 'skins',
    PARTS: 'parts',
};

module.exports = (ctx) => new DropService(ctx);