exports.up = function (knex) {
  return knex.schema.table("users", function (t) {
    t.string("phone");
  });
};

exports.down = function (knex) {
  return knex.schema.table("users", function (t) {
    t.dropColumn("phone");
  });
};
