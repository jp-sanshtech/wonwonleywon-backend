exports.up = function (knex) {
  return knex.schema.createTable ('types', t => {
    t.bigIncrements('id')
    t.string('name')
    t.integer('areaAmount')
    t.text('label')
    t.text('womenproductimage')
    t.text('menproductimage')
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable('types');
};


