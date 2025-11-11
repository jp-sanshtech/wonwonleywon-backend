// knexfile.js

require('dotenv').config();

module.exports = {
  development: {
    client: "pg",
    connection: {
      database: "wonwonleywon",
      user: "postgres",
      password: "Temp4now"
    },
    migrations: {
      directory: "./db/migrations"
    },
    seeds: {
      directory: "./seeds"
    }
  },

  production: {
    client: "pg",
    connection: process.env.DATABASE_URL,
    migrations: {
      directory: "./db/migrations"
    },
    seeds: {
      directory: "./seeds"
    }
  }
};
