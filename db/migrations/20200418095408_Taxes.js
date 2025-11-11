
exports.up = function (knex) {
  return knex.schema.createTable('taxes', t => {
    t.bigIncrements('id')
    t.string('area')
    t.string('shippingCost')
    t.string('tax')
    t.string('duty')
  })

};

exports.down = function (knex) {
  return knex.schema.dropTable('taxes')
};
