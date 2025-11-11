exports.up = function(knex) {
    return knex.schema.table('types', function(table) {
      table.boolean('preSale').defaultTo(false);
      table.text('preSaleText').defaultTo('');
    });
  };
  
  exports.down = function(knex) {
    return knex.schema.table('types', function(table) {
      table.dropColumn('preSale');
      table.dropColumn('preSaleText');
    });
  };