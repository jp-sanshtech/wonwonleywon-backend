
exports.up = function(knex) {
    return knex.schema.table("types", (t) => {
        t.boolean("discount").defaultTo(false);
        t.text("discountCode").defaultTo("");
    });
};

exports.down = function(knex) {
    return knex.schema.table("types", (t) => {
        t.dropColumn("discount");
        t.dropColumn("discountCode");
    });
};
