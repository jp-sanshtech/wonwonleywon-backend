
exports.up = function(knex) {
    return knex.schema.table('types', function (t) {
        t.text('authPortalText').defaultTo('');
    });
};

exports.down = function(knex) {
    return knex.schema.table('types', function (t) {
        t.dropColumn('authPortalText');
    });
};


