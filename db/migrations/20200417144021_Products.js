
exports.up = function (knex) {
  return knex.schema.createTable('products', t => {
    t.bigIncrements('id')
    t.string('name')
    t.string('priceCanada')
    t.string('priceUs')
    t.string('size')
    t.string('cardNumber')
    t.integer('status')//1 normal 0 sold
    t.integer('typeId').references('id').inTable('types')
    t.integer('gender')//(0, women, 1 men, 2 all)
    t.specificType('color', 'text ARRAY');
    t.boolean("removeShipmentCharge");
    t.boolean("singleproduct");
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable('products');
};
