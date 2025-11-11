
exports.up = function(knex) {
    return knex.schema.table("orders", (t) => {
        t.text("discountCode").defaultTo("");
        t.integer("discountAmount").defaultTo(0);
    });
  
};

exports.down = function(knex) {
    return knex.schema.table("orders", (t) => {
        t.dropColumn("discountCode");
        t.dropColumn("discountAmount");
    });
  
};
