module.exports = function (context) {
    //context.services - /services/index.js
    //context.socket - user socket
    //context.db - db models /models/index.js
    //context.data - data from request
    //context.logger - winston logger
    //context.io - for public broadcast



    // сначала был сундук, у него был sunduk_id
    // были drop_types привязанные к sunduk_id
    // берем типы дропов для сундука, смотрим на ограничения сундука
    // выбираем случайныйным, псевдо случайным образом типы итемов, которые упадут, учитываем различные условия
    // по выбранным типам находим итемы КОТОРЫХ НЕТ У ПОЛЬЗОВАТЕЛЯ ( ПИЗДА ВАЖНО )
    // случайным образом выбираем из этих итемов
    // отправляем юзеру

    //тип дропа
    /**
     * @int id - primary key
     * @int container_id - container id - relation
     * @string item_type - например car
     * @int min_items_count - минимальное количество итемов данного типа
     * @int max_items_count - максимальное количество итемов типа
     * @int slot_number - номер слота
     * @string minimal_class - minimal class of dropped item
     * @string maximal_class - maximal class of dropped item
     * ... - остальные поля которые влияют на ограничения
     * @json meta - различные другие параметры
     */
};