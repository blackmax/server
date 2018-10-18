const Service = require('./service');
const {Op} = require('sequelize');

function roll(min, max) {
    return (Math.random() + min) % max;
}

// значения скинов, массив 0 => <el>, 1 => <el> - чем больше тем значимее
const SKIN_RARITY_WEIGHT = ['common', 'uncommon', 'rare', 'epic', 'legendary'];

// возвращает вес в массиве строк, для рола
const array_weights = (minimalString, maximalString, items) => {
    const minimalWeight = items.findIndex(el => el === minimalString);
    const maximalWeight = items.findIndex(el => el === maximalString);

    return [minimalWeight, maximalWeight];
};

class DropType {
    constructor(db) {
        this.db = db;
    }

    async getDroppedItems(...args) {
        return {};
    }
}

class GoldDropType extends DropType {
    async getDroppedItems(...args) {
        return {
            dropped: 50,
            type: 'gold',
            xor: {
                weight: 4,
                slot_id: 1,
                roll: 60,
            },
        }
    }
}

class ItemDropType extends DropType {
    async getDroppedItems({paremeters, user_id}) {
        const [min, max] = array_weights(parameters.minimal_weight, parameters.maximal_weight, SKIN_RARITY_WEIGHT);
        const skinsLevels = SKIN_RARITY_WEIGHT.filter((item, key) => min <= key && key <= max);
        //получаем возможные скины
        const userSkinIds = await this.db.user_skin.findAll({attributes: ['id'], where: {user_id}});
        //получаем скины которые можно дропнутьк
        const skins = await this.db.skins.findAll({
            attributes: ['id'],
            where: {
                id: {
                    [Op.notIn]: userSkinIds.map(el => el.id),
                },
                rarity: {
                    [Op.in]: skinsLevels,
                }
            }
        });

        return {
            dropped: skins,
            type: 'skins',
            or: {
                type: 'gold'
            }
        }
    }
}

class SkinsDropType extends DropType {
    async getDroppedItems(...args) {

    }
}

class DropService extends Service {
    constructor(ctx) {
        super(ctx);
        this.dropTypes = [];
        DropService.dropTypes.forEach(dropType => {
            this.dropTypes.push(new dropType(ctx.db).getDroppedItems());
        });
    }

    mergeDroppedItems(drops) {


    }

    async handleDrop(user_id, containerId) {
        const dropTypes = await this.ctx.db.drop_types.findAll({where: {container_id: containerId}});
        const drops = dropTypes.map((parameters, key) => this.dropTypes[key].getDroppedItems({
            parameters,
            user_id
        }));

        return this.mergeDroppedItems(drops);
    }
}

DropService.dropTypes = [];