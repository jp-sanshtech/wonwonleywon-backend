exports.up = function (knex) {
    return knex.schema.table("products", function (t) {
        t.integer("sizeId");
    });
};

exports.down = function (knex) {
    return knex.schema.table("products", function (t) {
        t.dropColumn("sizeId");
    });
};
