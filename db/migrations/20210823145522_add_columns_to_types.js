exports.up = function (knex) {
  return knex.schema.table("types", (t) => {
    t.string("menMeaning");
    t.string("womenMeaning");
  });
};

exports.down = function (knex) {
  return knex.schema.table("types", (t) => {
    t.dropColumn("menMeaning");
    t.dropColumn("womenMeaning");
  });
};
