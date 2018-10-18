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

    getItemsForDrop(criteria, userId) {
        switch (criteria.drop_type) {
            case 'gold':
                return 0;
        }
    }

    exchangeForGold(criteria, userId) {
        switch (criteria.drop_type) {

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
        const [container, items] = Promise.all([
            this.ctx.db.container_types.find({where: {id: containerId}}),
            this.ctx.db.drop_from_container.findAll({where: {container_id: containerId}}),
        ]);
        const slotsAvailable = container.slots;
        const droppedItems = {gold: 0};
        while (slotsAvailable) {
            // берем критерии для группы
            const slotItems = items.filter(el => el.slot_number === slotsAvailable);
            // выбираем 1 тип итема
            const item = this.rollItem(slotItems);

            const itemsForDrop = this.getItemsForDrop(item, userId);

            if (!items) {
                droppedItems.gold += this.exchangeForGold(item, userId);
                continue;
            }

            droppedItems[item.drop_type].push(this.rollItem(itemsForDrop, item.min_value, item.max_value));
        }

    }
}


DropService.dropTypes = [];