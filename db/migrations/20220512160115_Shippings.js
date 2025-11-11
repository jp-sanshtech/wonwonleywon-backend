exports.up = function (knex) {
    return knex.schema.createTable('shippings', t => {
        t.bigIncrements('id')
        t.float("price")
        t.integer('countryId').references('id').inTable('countries')
        t.integer('typeId')
    });
};

exports.down = function (knex) {
    return knex.schema.dropTable('shippings');
};
