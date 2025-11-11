exports.up = function (knex) {
  return knex.schema.createTable("answers", (t) => {
    t.bigIncrements("id");
    t.integer("typeId").unsigned().references('types.id').onDelete('CASCADE');
    t.string("email");
    t.json("result");
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable("answers");
};
