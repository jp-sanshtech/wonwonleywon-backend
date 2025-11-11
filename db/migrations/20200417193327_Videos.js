exports.up = function (knex) {
  return knex.schema.createTable('videos', t => {
    t.bigIncrements('id')
    t.integer('pid')
    t.string('url')
    t.integer('type')//1, product video, 2, siz3, 
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable('videos');
};


