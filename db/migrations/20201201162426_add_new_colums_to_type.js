
exports.up = function (knex) {
    return knex.schema.table('types', function (t) {
        t.string('videoUrl');
        t.string('proPrice');
        t.string('sizeGuide');
        t.integer('gender')//(0, women, 1 men, 2 all)
    });
};

exports.down = function (knex) {
    return knex.schema.table('types', function (t) {
        t.dropColumn('videoUrl');
        t.dropColumn('proPrice');
        t.dropColumn('sizeGuide');
        t.dropColumn('gender');
    });
};
