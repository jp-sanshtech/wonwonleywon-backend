exports.up = function (knex) {
  return knex.schema.createTable("options", (t) => {
    t.bigIncrements("id");
    t.integer("stepsId").unsigned().references('steps.id').onDelete('CASCADE');
    t.string("content");
    t.integer("index");
    t.string("imageUrl");
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable("options");
};
