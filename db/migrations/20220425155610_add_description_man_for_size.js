exports.up = function (knex) {
    return knex.schema.table("sizes", (t) => {
        t.text('menDescription')
    });
};

exports.down = function (knex) {
    return knex.schema.table("sizes", (t) => {
        t.dropColumn("menDescription");
    });
};
