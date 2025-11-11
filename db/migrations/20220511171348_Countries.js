exports.up = function (knex) {
    return knex.schema.createTable('countries', t => {
        t.bigIncrements('id')
        t.string("iso", 2)
        t.string("nicename", 80)
        t.string("name", 80)
        t.string("iso3", 3)
        t.integer("numcode", 6)
        t.integer("phonecode", 5)

    });
};

exports.down = function (knex) {
    return knex.schema.dropTable('countries');
};
