exports.up = function (knex) {
  return knex.schema.createTable("users", (t) => {
    t.bigIncrements("id");
    t.integer("role");
    t.string("email");
    t.string("name");
    t.string("address");
    t.string("city");
    t.string("state");
    t.string("country");
    t.string("postalCode");
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable("users");
};
