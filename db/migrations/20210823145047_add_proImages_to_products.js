exports.up = function (knex) {
  return knex.schema.table("products", (t) => {
    t.string("proImage");
  });
};

exports.down = function (knex) {
  return knex.schema.table("products", (t) => {
    t.dropColumn("proImage");
  });
};
