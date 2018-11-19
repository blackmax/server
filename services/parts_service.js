const Service = require('./service');
const {Op} = require('sequelize');

class PartsService extends Service {
    /**
     * сколько денег надо на следующий апгрейд
     * @param from
     * @param level
     * @returns {*}
     */
    static getUpgradePrice(from, level) {
        const half = from / 2;
        let price = from;
        for (let i = 2; i < level + 1; i++) {
            price += half + 100 * (i - 2);
        }

        return price;
    }

    async upgradePart(partId, user) {
        const [userPart, part] = await Promise.all([
            this.ctx.db.user_parts.findOne({where: {user_id: user.id, part_id: partId}}),
            this.ctx.db.parts.findOne({where: {id: partId}}),
        ]);

        if (userPart.part_lvl === part.max_lvl_upgrade) {
            // error
        }

        const upgradePrice = PartsService.getUpgradePrice(part.upgrade_price, userPart.part_lvl);

        if (!user.checkCurrency('money', upgradePrice)) {
            // error
        }

        userPart.part_lvl += 1;
        userPart.new = 0;
        await userPart.save();

        return userPart;

    }
}

module.exports = (ctx) => new PartsService(ctx);