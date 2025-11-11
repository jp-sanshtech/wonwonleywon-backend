exports.up = function (knex) {
  return knex.schema.createTable("productOwnership", (t) => {
    t.bigIncrements("id");
    t.integer("productId").references("id").inTable("products");
    t.string("email");
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable("productOwnership");
};
