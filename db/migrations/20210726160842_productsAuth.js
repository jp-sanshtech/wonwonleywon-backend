exports.up = function (knex) {
  return knex.schema.createTable("productsAuth", (t) => {
    t.bigIncrements("id");
    t.integer("pid").references("id").inTable("products");
    t.string("password");
    t.string("email");
    t.datetime("transferDateTime");
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable("productsAuth");
};
