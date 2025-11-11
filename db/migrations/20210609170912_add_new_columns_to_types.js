exports.up = function (knex) {
  return knex.schema.table("types", function (t) {
    t.string("maleVideoUrl");
    t.string("femaleVideoUrl");
    t.string("unisexVideoUrl");
    t.string("malePrice");
    t.string("femalePrice");
    t.string("unisexPrice");
  });
};

exports.down = function (knex) {
  return knex.schema.table("types", function (t) {
    t.dropColumn("maleVideoUrl");
    t.dropColumn("femaleVideoUrl");
    t.dropColumn("unisexVideoUrl");
    t.dropColumn("malePrice");
    t.dropColumn("femalePrice");
    t.dropColumn("unisexPrice");
  });
};
