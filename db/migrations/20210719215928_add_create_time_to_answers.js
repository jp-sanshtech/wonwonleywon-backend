exports.up = function (knex) {
    return knex.schema.table("answers", (t) => {
        t.timestamp("createdTime").defaultTo(knex.fn.now());
    });
};

exports.down = function (knex) {
    return knex.schema.table("answers", (t) => {
        t.dropColumn("createdTime");
    });
};