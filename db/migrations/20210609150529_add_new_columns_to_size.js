exports.up = function (knex) {
  return knex.schema.table("sizes", function (t) {
    t.string("gender");
  });
};

exports.down = function (knex) {
  return knex.schema.table("sizes", function (t) {
    t.dropColumn("gender");
  });
};
