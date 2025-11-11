exports.up = function (knex) {
  return knex.schema.createTable("members", (t) => {
    t.bigIncrements("id");
    t.string("email").unique().notNullable();
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable("members");
};
