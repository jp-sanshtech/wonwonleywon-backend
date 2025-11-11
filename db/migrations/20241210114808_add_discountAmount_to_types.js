
exports.up = function(knex) {
    return knex.schema.table("types", (t) => {
        t.integer("discountAmount").defaultTo(0);
    });
};

exports.down = function(knex) {
    return knex.schema.table("types", (t) => {
        t.dropColumn("discountAmount");
    });
};
