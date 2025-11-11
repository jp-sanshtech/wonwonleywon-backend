exports.up = function (knex) {
    return knex.schema.table('types', function (t) {
        t.text('dimensionBefore');
        t.text('dimensionDetails');
    });
};

exports.down = function (knex) {
    return knex.schema.table('types', function (t) {
        t.dropColumn('dimensionBefore');
        t.dropColumn('dimensionDetails');
    });
};
