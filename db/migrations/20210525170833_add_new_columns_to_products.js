exports.up = function (knex) {
  return knex.schema.table("products", function (t) {
    t.string("password");
  });
};

exports.down = function (knex) {
  return knex.schema.table("products", function (t) {
    t.dropColumn("password");
  });
};
