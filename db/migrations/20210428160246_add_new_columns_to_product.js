
exports.up = function (knex) {
    return knex.schema.table('products', function (t) {
        t.string('refund');
        t.string('tracking');
    });
};

exports.down = function (knex) {
    return knex.schema.table('products', function (t) {
        t.dropColumn('refund');
        t.dropColumn('tracking');
    });
};
