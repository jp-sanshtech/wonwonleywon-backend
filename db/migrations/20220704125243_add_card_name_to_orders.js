exports.up = function (knex) {
  return knex.schema.table("orders", (t) => {
    t.string("cardName");
  });
};

exports.down = function (knex) {
  return knex.schema.table("orders", (t) => {
    t.dropColumn("cardName");
  });
};
