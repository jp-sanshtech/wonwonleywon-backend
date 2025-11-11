exports.up = function (knex) {
    return knex.schema.table("sizes", function (t) {
        t.text("description");
    });
};

exports.down = function (knex) {
    return knex.schema.table("sizes", function (t) {
        t.dropColumn("description");
    });
};
