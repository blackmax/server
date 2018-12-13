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
        if (max === 0) {
            return 0;
        }
        let rand = min + Math.random() * (max - min);
        rand = Math.floor(rand);

        return rand;
    }

    /**
     * roll type of items which will be roled
     * @param criterias
     * @returns {*}
     */
    rollType(criterias) {
        const dropZone = criterias.reduce((prev, item) => {
            return prev + item.chance;
        }, 0);

        let points = this.randomInteger(1, dropZone);
        this.ctx.logger.debug(`rolling points ${points} out of ${dropZone}`);
        let iterations = 0;
        while (points > 0) {
            points -= criterias[iterations].chance;
            iterations += 1;
        }
        return criterias[iterations - 1];
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
            const key = this.randomInteger(0, items.length);
            if (droppedItems[key]) {
                continue;
            }
            const item = items[key];
            const isItemExists = droppedItems.find(element => element.id === item.id);
            if (!isItemExists) {
                droppedItems.push(item);
            }
        }

        return droppedItems;
    }

    /**
     * checking criteria and user data for get only uniq, fresh items needed for user
     * @param criteria - conditions for items
     * @param userId - id of user
     * @returns {number|array} - number if gold, array if some model type
     */
    async getItemsForDrop(criteria, user) {
        const userId = user.id;
        let userCars;
        const {skins, user_skin, user_parts, user_icons, user_cars, parts, cars, icons} = this.ctx.db;
        switch (criteria.drop_type) {
            case DropService.dropTypes.MONEY:
                const amount = this.randomInteger(criteria.min_value, criteria.max_value);
                user.addCurrency('money', amount);
                await user.save();
                return amount;
            case DropService.dropTypes.ICONS:
                const userIcons = await user_icons.findAll({where: {user_id: userId}});
                const dropableIcons = await icons.findAll({
                    where: {
                        id: {[Op.notIn]: userIcons.map(el => el.icon_id)},
                        dropable: 1,
                    }
                });

                if (dropableIcons == null) {
                    return null;
                }

                return this.rollItem(dropableIcons, 1, 1);
            case DropService.dropTypes.GOLD:
                user.addCurrency('gold', amount);
                await user.save();
                return this.randomInteger(criteria.min_value, criteria.max_value);
            case DropService.dropTypes.SKINS:
                let [userSkins, userCars] = await Promise.all([
                    user_skin.findAll({where: {user_id: userId}}),
                    user_cars.findAll({where: {user_id: userId}})
                ]);

                const availableForDropSkins = await skins.findAll({
                    where: {
                        id: {[Op.notIn]: userSkins.map(el => el.skin_id)},
                        car_id: {[Op.in]: userCars.map(el => el.id)},
                        rarity: criteria.rarity
                    }

                });
                // no available skins for drop
                if (availableForDropSkins === null) {
                    return null;
                }
                // choose skins from array of skins
                const droppedSkins = this.rollItem(availableForDropSkins, criteria.min_value, criteria.max_value);
                // attach skins to user
                await user_skin.create(droppedSkins.map(element => {
                    return {
                        new: 1,
                        skin_id: element.id,
                        user_id: userId,
                        car_id: element.car_id
                    }
                }));

                return droppedSkins;
            case DropService.dropTypes.PARTS:
                userCars = await user_cars.findAll({where: {user_id: userId}});
                const existingCars = await cars.findAll({
                    where: {
                        id: {
                            [Op.in]: userCars.map(element => element.car_id)
                        }
                    }
                });
                const userParts = await user_parts.findAll({where: {user_id: userId}});

                // выбираем запчасти которых нет у юзера
                const items = await parts.findAll({
                    attributes: ["id", "class", "type", "rarity"],
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

                let droppedCount = this.randomInteger(criteria.min_value, criteria.max_value);
                const partNumber = this.randomInteger(0, items.length);


                // если у текущей запчасти максимум - даем золото

                if(items[partNumber].part_number === 12){
                    return false;
                }

                //если итемов больше максимума возвращаем остаток
                if(droppedCount + items[partNumber].part_number > 12){
                    droppedCount = 12 - items[partNumber].part_number;
                }


                items[partNumber].setDataValue('count', droppedCount);

                user_parts.create({
                    user_id: userId,
                    part_id: items[partNumber].id,
                    part_lvl: 1,
                    part_number: droppedCount,
                    new: 1,
                });
                return items[partNumber];
            case DropService.dropTypes.CARTS:

                break;
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

    /**
     * handle drop for user and attach items to user
     * @param user
     * @param containerId
     * @returns {Promise<{slots: {}}>}
     */
    async handleDrop(user, containerId) {
        // получение контейнеров и типов дропа с него
        const [container, items] = await Promise.all([
            this.ctx.db.containers_types.find({where: {id: containerId}}),
            this.ctx.db.drop_from_container.findAll({where: {container_id: containerId}}),
        ]);
        let slotsAvailable = container.slots;
        let droppedItems = {slots: {}};
        //  обработка дропа для слотов
        while (slotsAvailable > 0) {
            this.ctx.logger.debug(`handling drop for slot ${slotsAvailable}`);
            // итемы которые можно дропнуть в текущем слоте
            const slotItems = items.filter(item => item.slot_number === slotsAvailable);
            slotsAvailable -= 1;
            this.ctx.logger.debug('rolling items', {items: slotItems.map(element => element.drop_type + " " + element.chance)});
            if (slotItems.length === 0) {
                continue;
            }
            // Выбираем тип итема, который будет в слоте
            const item = this.rollType(slotItems);
            this.ctx.logger.debug(`picked item ${item.drop_type}`);
            // получаем итемы по слоту
            const itemsForDrop = await this.getItemsForDrop(item, user.id);
            // если нет возможности дропнуть итем обмениваем на золото
            if (!itemsForDrop) {
                droppedItems.slots[slotsAvailable + 1] = {
                    [item.drop_type]: {
                        exchanged: true,
                        exchanged_type: 'money',
                        money: this.exchangeForMoney(item, user.id)
                    }
                };
                continue;
            }
            // добавляем итемы к результату
            droppedItems.slots[slotsAvailable + 1] = {
                [item.drop_type]: itemsForDrop
            };
        }
        return droppedItems;
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
    ICONS: 'icon',
    MONEY: 'money',
    SKINS: 'skin',
    PARTS: 'parts',
    CARTS: 'cars',
};

module.exports = (ctx) => new DropService(ctx);