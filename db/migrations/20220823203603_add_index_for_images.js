exports.up = function (knex) {
    return knex.schema.table("pictures", (t) => {
        t.integer("index", 4).defaultTo(0);
    });
};

exports.down = function (knex) {
    return knex.schema.table("pictures", (t) => {
        t.dropColumn("index");
    });
};
