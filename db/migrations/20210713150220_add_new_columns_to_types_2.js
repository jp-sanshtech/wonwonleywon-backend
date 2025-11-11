exports.up = function (knex) {
  return knex.schema.table("types", function (t) {
    t.string("maleTypeUrl");
    t.string("femaleTypeUrl");
    t.string("unisexTypeUrl");
  });
};

exports.down = function (knex) {
  return knex.schema.table("types", function (t) {
    t.dropColumn("maleTypeUrl");
    t.dropColumn("femaleTypeUrl");
    t.dropColumn("unisexTypeUrl");
  });
};
