
exports.up = function (knex) {
  return knex.schema.createTable('orders', t => {
    t.bigIncrements('id')
    t.integer('productId').references('id').inTable('products')
    t.integer('userId')
    t.string('orderCode')
    t.string('checkoutCode')
    t.timestamp('checkoutTime').defaultTo(knex.fn.now())
    t.integer('status', 2)
    t.string('finalPrice')
    t.integer('taxId').references('id').inTable('taxes')
  })

};

exports.down = function (knex) {
  return knex.schema.dropTable('orders')
};
