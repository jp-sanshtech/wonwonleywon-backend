exports.up = function (knex) {
  return knex.schema.createTable("steps", (t) => {
    t.bigIncrements("id");
    t.integer('sizeFinderId').unsigned().references('sizeFinder.id').onDelete('CASCADE')
    t.integer("type");
    t.text("description");
    t.integer("index");
    t.string("imageUrl");
    t.string("shortName");
    t.string("videoUrl");
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable("steps");
};
