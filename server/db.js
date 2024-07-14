const postgres = require("postgres");
const sql = postgres({
  host: "localhost",
  port: 5432,
  database: "postgres",
  username: "postgres",
  password: "postgres",
  max: 10,
});

module.exports = sql;
