exports.up = function (knex) {
    return knex.schema.createTable('sizes', t => {
        t.bigIncrements('id')
        t.string('name')
        t.integer('typeId').references('id').inTable('types')
    });
};

exports.down = function (knex) {
    return knex.schema.dropTable('sizes');
};
