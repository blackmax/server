module.exports = (sequelize, Types) => {
    const {INTEGER, TEXT, BOOLEAN, STRING} = Types;

    const DropFromContainer = sequelize.define('drop_from_container', {
        id: {
            type: INTEGER(11).UNSIGNED,
            primaryKey: true,
            autoIncrement: true,
        },
        container_id: INTEGER(11),
        slot_number: INTEGER(11),
        drop_type: STRING(50),
        chance: INTEGER(11),
        min_value: INTEGER(11),
        max_value: INTEGER(11),
        rarity: STRING(50),
    });

    return DropFromContainer;
};