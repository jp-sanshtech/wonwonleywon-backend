const { seed: seedTaxes } = require("./01_taxes");
const { seed: seedTypes } = require("./02_types");
const { seed: seedCountries } = require("./03_countries");
const knex = require("../db/client");

const seeding = async () => {
  try {
    await seedTaxes(knex);
    await seedTypes(knex);
    await seedCountries(knex);
    console.log("Success");
  } catch (error) {
    console.log(error);
  }
};
seeding();
