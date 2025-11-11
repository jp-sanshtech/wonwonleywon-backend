
exports.seed = function (knex) {
  // Deletes ALL existing entries
  return knex('types').del()
    .then(function () {
      // Inserts seed entries
      return knex('types').insert([
        { name: 'bag', areaAmount: 4, gender: 2 }
      ]);
    });
};
