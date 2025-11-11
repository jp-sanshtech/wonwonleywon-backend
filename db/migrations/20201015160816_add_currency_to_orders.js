
exports.up = function (knex) {
    return knex.schema.table('orders', function (t) {
        t.string('currency');
    });
};

exports.down = function (knex) {
    return knex.schema.table('orders', function (t) {
        t.dropColumn('currency');
    });
};
