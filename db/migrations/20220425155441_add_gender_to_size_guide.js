exports.up = function (knex) {
    return knex.schema.table("sizeGuides", (t) => {
        t.integer('gender')//(0, women, 1 men, 2 all)
    });
};

exports.down = function (knex) {
    return knex.schema.table("sizeGuides", (t) => {
        t.dropColumn("gender");
    });
};
