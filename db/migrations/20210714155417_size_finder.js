exports.up = function (knex) {
  return knex.schema.createTable("sizeFinder", (t) => {
    t.bigIncrements("id");
    t.integer("numberOfSteps");
    t.integer("gender");
    t.integer("typeId").unsigned().references('types.id').onDelete('CASCADE');
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable("sizeFinder");
};
