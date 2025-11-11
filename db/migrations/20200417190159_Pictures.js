exports.up = function (knex) {
  return knex.schema.createTable('pictures', t => {
    t.bigIncrements('id')
    t.integer('productId')
    t.string('url')
    t.integer('type') // 1 product detail, 2 details and auth, 3 dimension
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable('pictures');
};
