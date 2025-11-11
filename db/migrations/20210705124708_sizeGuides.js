exports.up = function (knex) {
  return knex.schema.createTable("sizeGuides", (t) => {
    t.bigIncrements("id");
    t.string("name");
    t.integer("sizeId").references("id").inTable("sizes");
    t.integer("index");
    t.string("fromInches");
    t.string("toInches");
    t.string("fromCm");
    t.string("toCm");
    t.text("description");
    t.string("imageUrl");
    t.integer("type");
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable("sizeGuides");
};
